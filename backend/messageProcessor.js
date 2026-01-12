const fs = require("fs");
const path = require("path");
const { getAIResponse } = require("./services/aiService");

let knowledge = { intents: [] };

// Load knowledge base safely
try {
  const knowledgePath = path.join(__dirname, "dataset", "knowledge.json");
  const rawData = fs.readFileSync(knowledgePath, "utf-8");
  knowledge = JSON.parse(rawData);
} catch {
  knowledge = { intents: [] };
}

// Rule-based intent matcher
function detectIntent(message) {
  const normalized = message.toLowerCase();

  for (const intent of knowledge.intents) {
    for (const pattern of intent.patterns || []) {
      if (normalized.includes(pattern.toLowerCase())) {
        return {
          reply: intent.responses?.[0] || "I understand.",
          escalated: false,
          confidence: 0.8,
        };
      }
    }
  }

  return null;
}

module.exports = async function processMessage(message) {
  // 1️⃣ Try rule-based
  const intentResult = detectIntent(message);
  if (intentResult) return intentResult;

  // 2️⃣ AI fallback (Gemini only)
  const aiResult = await getAIResponse(message);
  if (aiResult) return aiResult;

  // 3️⃣ Final fallback
  return {
    reply: "I’m not sure about that yet. Please try again later.",
    escalated: true,
    confidence: 0.0,
  };
};
