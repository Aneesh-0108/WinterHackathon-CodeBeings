// ============================================================================
// BACKEND-LOGIC ADAPTER
// ============================================================================

/**
 * Process message and return response
 * 
 * API Contract (MUST include confidence field):
 * {
 *   reply: string,
 *   escalated: boolean,
 *   confidence: number  // 0.0 to 1.0
 * }
 */
async function processMessage(message) {
    try {
        // Simulate async processing
        await new Promise(resolve => setTimeout(resolve, 100));

        // PLACEHOLDER RESPONSE
        // In production, confidence would be calculated based on intent matching
        const response = {
            reply: 'Thank you for your message. This is a placeholder response from backend-logic.',
            escalated: false,
            confidence: 0.85  // NEW: Confidence score (85%)
        };

        // Validate response format
        if (!response.reply || typeof response.reply !== 'string') {
            throw new Error('Invalid reply format');
        }

        if (typeof response.escalated !== 'boolean') {
            throw new Error('Invalid escalated format');
        }

        if (typeof response.confidence !== 'number') {
            throw new Error('Invalid confidence format');
        }

        return response;

    } catch (error) {
        console.error('[Backend-Logic] Error:', error.message);

        // Return safe fallback
        return {
            reply: 'I encountered an issue processing your request. A human agent will assist you shortly.',
            escalated: true,
            confidence: 0.0  // Zero confidence on error
        };
    }
}

module.exports = {
    processMessage
};