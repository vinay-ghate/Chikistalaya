// pinecone.mjs
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const pinecone = process.env.PINECONE_API_KEY
  ? new PineconeClient({ apiKey: process.env.PINECONE_API_KEY })
  : null;

if (!process.env.PINECONE_API_KEY) {
  console.warn("Warning: PINECONE_API_KEY is missing. Pinecone client will not be initialized.");
}

export default pinecone;
