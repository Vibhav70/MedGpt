const express = require("express");
const dotenv = require("dotenv");
const { Pinecone } = require("@pinecone-database/pinecone");
const fetch = require("node-fetch");

dotenv.config();

const app = express();
app.use(express.json());

// Load environment variables
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Pinecone configuration
const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY
  });


const indexName = "finaltest";
const index = pinecone.Index(indexName);

// Function to retrieve relevant context from Pinecone
async function getRelevantPassage(query, maxResults = 3) {
  const queryVector = await fetch(`https://huggingface.co/embed-model`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: query }),
  }).then((res) => res.json());

  const results = await index.query({
    vector: queryVector,
    topK: maxResults,
    includeMetadata: true,
  });

  if (results.matches) {
    return results.matches
      .map(
        (result) =>
          `- ${result.metadata.book_title || "Unknown Book"} (Page ${
            result.metadata.chunk_index || "Unknown"
          }): ${result.metadata.text || "No content available"}`
      )
      .join("\n");
  }
  return "No relevant context found.";
}

// Function to generate a response using Google Generative AI
async function generateAnswer(systemMessage, chatHistory, prompt) {
  const fullPrompt = `${systemMessage}\n\n${chatHistory}\nUser: ${prompt}\nAssistant:`;

  const response = await fetch("https://api.google.com/generative-ai", {
    method: "POST",
    headers: { Authorization: `Bearer ${GOOGLE_API_KEY}` },
    body: JSON.stringify({ prompt: fullPrompt }),
  }).then((res) => res.json());

  return response.text || "Failed to generate response.";
}

// API Endpoint for chat
app.post("/chat", async (req, res) => {
  const { userInput, chatHistory } = req.body;

  const systemMessage =
    "You are a helpful assistant specifically designed to provide comprehensive answers based on the given context from medical books and resources.";
  const isQuestion = /what|why|how|when|where|who|is|are|does|do|can|should/i.test(
    userInput
  );

  const context = await getRelevantPassage(userInput);
  const instruction = isQuestion
    ? "Answer the user's question in detail using all the information from the provided context. If the context does not contain the answer, respond with: 'The provided context does not contain sufficient information.'"
    : "Provide all relevant information about the given topic using the provided context. Be detailed and comprehensive.";

  const prompt = `${instruction}\n\n### User Input:\n${userInput}\n\n### Context:\n${context}\n\n### Response:`;

  const answer = await generateAnswer(systemMessage, chatHistory, prompt);

  res.json({ answer, context });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
