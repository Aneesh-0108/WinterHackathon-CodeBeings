function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();
}

module.exports = normalizeText;