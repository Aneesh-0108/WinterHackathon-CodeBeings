/**
 * BACKEND-LOGIC: Intent Detection Layer
 * ------------------------------------
 * Responsibilities:
 * - Load knowledge base
 * - Detect intent
 * - Return response object
 *
 * Must NEVER crash backend-core
 */

const fs = require("fs");
const path = require("path");

// ==============================
// LOAD KNOWLEDGE BASE SAFELY
// ==============================

let knowledge = { intents: [] };

try {
  const knowledgePath = path.join(__dirname, "dataset", "knowledge.json");
  const rawData = fs.readFileSync(knowledgePath, "utf-8");
  knowledge = JSON.parse(rawData);

  if (!Array.isArray(knowledge.intents)) {
    throw new Error("Invalid knowledge.json format: intents must be an array");
  }
} catch (err) {
  console.error("❌ Failed to load knowledge.json:", err.message);
  knowledge = { intents: [] }; // fail safe
}

// ==============================
// INTENT MATCHER
// ==============================

function detectIntent(message) {
  const normalized = message.toLowerCase();

  for (const intent of knowledge.intents) {
    if (!Array.isArray(intent.patterns)) continue;

    for (const pattern of intent.patterns) {
      if (normalized.includes(pattern.toLowerCase())) {
        return {
          reply: intent.responses?.[0] || "I understand your issue.",
          escalated: Boolean(intent.escalate),
          confidence:
            typeof intent.confidence === "number" ? intent.confidence : 0.7,
        };
      }
    }
  }

  // ==============================
  // FALLBACK (NO INTENT MATCH)
  // ==============================

  return {
    reply:
      "I'm not fully confident about this request. A human agent will assist you shortly.",
    escalated: true,
    confidence: 0.0,
  };
}

// ==============================
// EXPORTED ENTRY POINT
// ==============================

module.exports = function processMessage(message) {
  return {
    reply: "I’m not confident about this. An admin will review it.",
    confidence: 0.25,
    escalated: true,
    reason: "rule_fallback",
  };
};
