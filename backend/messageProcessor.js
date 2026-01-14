const fs = require("fs");
const path = require("path");

let knowledge = { intents: [] };

// ==============================
// LOAD KNOWLEDGE BASE SAFELY
// ==============================
try {
  const knowledgePath = path.join(__dirname, "dataset", "knowledge.json");
  const rawData = fs.readFileSync(knowledgePath, "utf-8");
  const parsed = JSON.parse(rawData);

  if (!Array.isArray(parsed.intents)) {
    throw new Error("Invalid knowledge.json format: intents must be an array");
  }

  knowledge = parsed;
} catch (err) {
  console.error("❌ Failed to load knowledge.json:", err.message);
  knowledge = { intents: [] }; // fail-safe
}

// ==============================
// RULE-BASED INTENT DETECTION
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

  return null; // no intent matched
}

// ==============================
// EXPORTED ENTRY POINT (USED BY server.js)
// ==============================
module.exports = async function processMessage(message) {
  const intentResult = detectIntent(message);

  // ✅ Intent matched
  if (intentResult) {
    return intentResult;
  }

  // ⚠️ Fallback (no intent matched)
  return {
    reply:
      "I'm not fully confident about this request. A human agent will assist you shortly.",
    escalated: true,
    confidence: 0.0,
  };
};
