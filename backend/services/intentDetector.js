const normalizeText = require("../utils/normalizeText");
const knowledge = require("../data/knowledge.json");

function detectIntent(message) {
  const cleanMessage = normalizeText(message);

  for (const intentObj of knowledge.intents) {
    for (const pattern of intentObj.patterns) {
      if (cleanMessage.includes(normalizeText(pattern))) {
        return intentObj;
      }
    }
  }

  return null; // no intent matched
}

module.exports = detectIntent;
