// routes/medichatRoutes.mjs
import express from "express";
import { app as cragApp } from "../graph.js";

const router = express.Router();

router.post("/medi-chat", async (req, res) => {
  try {
    const { question, medicalRecordsText } = req.body;

    // The initial CRAG state
    const initialState = {
      question,
      medicalRecordsText,
      documents: [],
      generation: "",
    };

    // Get the async iterator
    const stateStream = await cragApp.stream(initialState, {
      recursionLimit: 10,
    });
    let finalState;

    // Iterate over the stream to capture the last partial state
    for await (const partialState of stateStream) {
      finalState = partialState;
    }

    // finalState should now hold the "final" result of the CRAG pipeline
    console.log("Final CRAG state:", finalState);

    // Return the final answer
    // The final state structure depends on how LangGraph returns it.
    // It might be nested under the last node name or just the state itself.
    // Based on the graph definition, 'generation' is a key in the state.

    // Check if finalState has 'generation' directly or if it's nested
    const answer = finalState.generation || finalState.generate?.generation || "No answer generated.";

    return res.json({ answer });
  } catch (err) {
    console.error("CRAG error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
