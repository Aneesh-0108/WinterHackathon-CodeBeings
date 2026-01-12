function generateResponse(intentObj) {
  if (!intentObj || !intentObj.responses || intentObj.responses.length === 0) {
    return "I couldn't clearly understand the issue. Could you please explain a bit more?";
  }

  // You can randomize later if you want
  return intentObj.responses[0];
}

module.exports = generateResponse;
