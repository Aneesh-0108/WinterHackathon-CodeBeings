const detectIntent = require("./services/intentDetector");
const generateResponse = require("./services/responseGenerator");
const shouldEscalate = require("./services/escalationService");

function processMessage(message) {
  const intentObj = detectIntent(message);

  // Fallback if no intent matched
  if (!intentObj) {
    return {
      reply:
        "I couldn’t clearly understand the issue. Could you please explain a bit more?",
      escalated: false,
      confidence: 0.3,
    };
  }

  const reply = generateResponse(intentObj);
  const escalated = shouldEscalate(intentObj);
  const confidence =
    typeof intentObj.confidence === "number" ? intentObj.confidence : 0.5;

  return {
    reply,
    escalated,
    confidence,
  };
}

module.exports = {
  processMessage,
};
