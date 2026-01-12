function shouldEscalate(intentObj) {
    if (!intentObj) return false;
    return Boolean(intentObj.escalate);
}

module.exports = shouldEscalate;