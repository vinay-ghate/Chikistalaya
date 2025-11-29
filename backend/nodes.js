
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import pinecone from "./pinecone.js";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

console.log("Initializing GoogleGenAI with API Key length:", process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.length : "None");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
});

const modelName = 'gemini-2.0-flash-lite';

// Helper function to generate content using Google GenAI
async function generateContent(promptText) {
  console.log("Generating content with model:", modelName);
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }],
        },
      ],
    });

    console.log("Response keys:", Object.keys(response));
    console.log("Type of response.text:", typeof response.text);

    if (typeof response.text === 'function') {
      const text = response.text();
      console.log("Generated text length:", text.length);
      return text;
    } else if (typeof response.text === 'string') {
      return response.text;
    } else {
      console.log("Response candidates:", JSON.stringify(response.candidates, null, 2));
      if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts.length > 0) {
        return response.candidates[0].content.parts[0].text;
      }
      return "No text generated";
    }

  } catch (error) {
    console.error("Error generating content:", error);
    throw error; // Re-throw to be caught by caller
  }
}

export async function retrieve(state) {
  console.log("---RETRIEVE---");
  console.log("Input state:", state);

  try {
    const pineconeIndex = pinecone.Index("curo-2");
    const embeddings = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
    });

    const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      textKey: "text",
      namespace: "pdf-chunks",
    });

    const retrievedPdfDocs = await pineconeStore.similaritySearch(
      state.question,
      5
    );

    let userTextDocs = [];
    if (state.medicalRecordsText) {
      userTextDocs = [
        new Document({
          pageContent: state.medicalRecordsText,
          metadata: { type: "userInput" },
        }),
      ];
    }

    const documents = [...retrievedPdfDocs, ...userTextDocs];
    console.log("Retrieved documents count:", documents.length);
    return { documents };
  } catch (error) {
    console.error("Error in retrieve:", error);
    return { documents: [] };
  }
}

export async function gradeDocuments(state) {
  console.log("---CHECK RELEVANCE---");

  const filteredDocs = [];
  for (const doc of state.documents || []) {

    const prompt = `
      You are a grader checking if the text below is relevant to the user’s question.
      
      Text:
      ${doc.pageContent}
      
      Question:
      ${state.question}
      
      Answer ONLY with a JSON object containing a single key 'binaryScore' with value "yes" or "no".
      Example: {"binaryScore": "yes"}
      Do not include any markdown formatting or explanations.
    `;

    try {
      const result = await generateContent(prompt);

      let grade = { binaryScore: "no" };
      try {
        // Clean up potential markdown code blocks
        const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
        grade = JSON.parse(cleanResult);
      } catch (e) {
        console.error("Error parsing grade JSON:", e);
      }

      if (grade.binaryScore === "yes") {
        filteredDocs.push(doc);
      }
    } catch (e) {
      console.error("Error grading doc:", e);
    }
  }
  console.log("Documents after grading count:", filteredDocs.length);
  return { documents: filteredDocs };
}

export function decideToGenerate(state) {
  console.log("---DECIDE TO GENERATE---");
  if (!state.documents || state.documents.length === 0) {
    console.log("No documents found, transforming query.");
    return "transformQuery";
  }
  console.log("Proceeding to generate.");
  return "generate";
}

export async function transformQuery(state) {
  console.log("---TRANSFORM QUERY---");
  console.log("Original question:", state.question);

  const prompt = `
    Rewrite the user question to be more explicit and suitable for a web search.
    Only give the new question as response, no other text.
    
    Original:
    ${state.question}
    
    Improved:
  `;

  try {
    let newQ = await generateContent(prompt);
    newQ = newQ.replace(/.*"(.*?)".*/s, "$1").trim();
    console.log("Transformed question:", newQ);
    return { question: newQ };
  } catch (e) {
    console.error("Error transforming query:", e);
    return { question: state.question };
  }
}

export async function webSearch(state) {
  console.log("---WEB SEARCH---");
  try {
    const tool = new TavilySearchResults();
    const resultsText = await tool.invoke({ input: state.question });

    const webDoc = new Document({
      pageContent: resultsText,
      metadata: { type: "webSearch" },
    });
    const combinedDocs = (state.documents || []).concat(webDoc);
    console.log("Documents after web search count:", combinedDocs.length);
    return { documents: combinedDocs };
  } catch (e) {
    console.error("Error in webSearch:", e);
    return { documents: state.documents || [] };
  }
}

export async function generate(state) {
  console.log("---GENERATE---");

  const docsAsString = state.documents
    .map(
      (doc, i) =>
        `DOC #${i + 1} (type: ${doc.metadata?.type || "pdfChunk"}):\n${doc.pageContent}`
    )
    .join("\n\n");

  const prompt = `
    You are a medical professional and act like one. Use ONLY the following text to answer the user’s question:
    ${docsAsString}
    
    User’s question: ${state.question}
    
    Try to answer from the context. If you can't, you have a tool to search the web as well.
  `;

  try {
    const generation = await generateContent(prompt);
    console.log("Generated answer:", generation);
    return { generation };
  } catch (err) {
    console.error("Error in generate node:", err);
    return { generation: "I apologize, but I encountered an error while generating the response: " + err.message };
  }
}
