// ============================================================================
// BACKEND-CORE:  API GATEWAY LAYER
// Phase 5: Frontend/Backend Synchronization
// ============================================================================

/**
 * ARCHITECTURAL PRINCIPLE:
 * 
 * Backend-core is the STABILITY LAYER between frontend and backend-logic.
 * 
 * Responsibilities:
 * - Enforce strict API contracts
 * - Validate all inputs
 * - Standardize all outputs
 * - Isolate frontend from backend-logic failures
 * - Provide request traceability
 * 
 * NOT Responsible For:
 * - Business logic
 * - Intent detection
 * - Dataset access
 * - Response generation logic
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

// Import backend-logic adapter (treated as unreliable third-party service)
const processMessage = require('./messageProcessor');

// ============================================================================
// EXPRESS SETUP
// ============================================================================

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ============================================================================
// API CONTRACT DEFINITION (Frontend Dependency)
// ============================================================================

/**
 * GUARANTEED RESPONSE SHAPE:
 * 
 * Every /chat response MUST have exactly these fields:
 * {
 *   reply: string,       // Always present, never empty
 *   escalated: boolean,  // Always present
 *   confidence: number   // Always present, 0.0 to 1.0
 * }
 * 
 * Frontend depends on this contract being ALWAYS respected.
 * Missing fields = frontend crashes = bad user experience.
 */

const API_CONTRACT = {
    DEFAULT_REPLY: 'I apologize, but I encountered a temporary issue. Please try again in a moment.',
    DEFAULT_ESCALATED: true,
    DEFAULT_CONFIDENCE: 0.0,
    FALLBACK_REPLY: 'Our system is experiencing difficulties. A human agent will assist you shortly.',
    FALLBACK_ESCALATED: true,
    FALLBACK_CONFIDENCE: 0.0
};

// ============================================================================
// REQUEST ID MIDDLEWARE (Traceability)
// ============================================================================

/**
 * Generate unique ID for each request
 * 
 * Purpose: 
 * - Debug frontend issues by correlating backend logs
 * - Trace request flow through system
 * - Attach to response headers for frontend logging
 */
function requestIdMiddleware(req, res, next) {
    req.requestId = crypto.randomUUID();

    // Attach to response headers so frontend can log it
    res.setHeader('X-Request-ID', req.requestId);

    next();
}

app.use(requestIdMiddleware);

// ============================================================================
// MINIMAL LOGGING (Production-Safe)
// ============================================================================

/**
 * Minimal structured logging
 * Only logs errors and critical events
 */
const logger = {
    error: (message, meta = {}) => {
        console.error(JSON.stringify({
            level: 'ERROR',
            timestamp: new Date().toISOString(),
            message,
            ...meta
        }));
    }
};

// ============================================================================
// RESPONSE STANDARDIZATION HELPER
// ============================================================================

/**
 * Ensures response always matches API contract
 * 
 * Why this exists:
 * Backend-logic may return incomplete data, wrong types, or fail entirely. 
 * This function GUARANTEES frontend receives valid shape.
 * 
 * @param {any} backendLogicResponse - Potentially invalid/incomplete response
 * @returns {Object} - Always valid API contract response
 */
function standardizeResponse(backendLogicResponse) {
    // If backend-logic returned nothing or invalid type
    if (!backendLogicResponse || typeof backendLogicResponse !== 'object') {
        return {
            reply: API_CONTRACT.FALLBACK_REPLY,
            escalated: API_CONTRACT.FALLBACK_ESCALATED,
            confidence: API_CONTRACT.FALLBACK_CONFIDENCE
        };
    }

    // Safely extract fields with type checking and defaults
    const reply = (typeof backendLogicResponse.reply === 'string' && backendLogicResponse.reply.trim() !== '')
        ? backendLogicResponse.reply
        : API_CONTRACT.DEFAULT_REPLY;

    const escalated = typeof backendLogicResponse.escalated === 'boolean'
        ? backendLogicResponse.escalated
        : API_CONTRACT.DEFAULT_ESCALATED;

    let confidence = typeof backendLogicResponse.confidence === 'number'
        ? backendLogicResponse.confidence
        : API_CONTRACT.DEFAULT_CONFIDENCE;

    // Clamp confidence to valid range [0.0, 1.0]
    confidence = Math.max(0.0, Math.min(1.0, confidence));

    // Return guaranteed valid response
    return {
        reply,
        escalated,
        confidence
    };
}

// ============================================================================
// MAIN CHAT ENDPOINT (Frontend-Facing API)
// ============================================================================

app.post('/chat', async (req, res) => {

    const requestId = req.requestId;

    try {
        // ========================================================================
        // STAGE 1: INPUT VALIDATION (Reject bad requests immediately)
        // ========================================================================

        /**
         * Why validate here:
         * - Bad input = frontend error (HTTP 400)
         * - Backend-logic should only receive valid input
         * - Prevents wasted processing
         */

        const userMessage = req.body.message;

        // Check message exists and is valid string
        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
            return res.status(400).json({
                error: 'Invalid request: "message" must be a non-empty string',
                requestId
            });
        }

        // ========================================================================
        // STAGE 2: DELEGATE TO BACKEND-LOGIC (Unsafe Zone)
        // ========================================================================

        /**
         * Why treat backend-logic as unreliable: 
         * - It may throw errors
         * - It may return incomplete data
         * - It may hang or timeout
         * - We must isolate frontend from these failures
         */

        let backendLogicResponse;

        try {
            // Call backend-logic adapter
            backendLogicResponse = await processMessage(userMessage);

        } catch (logicError) {
            // Backend-logic threw an error - isolate it
            logger.error('Backend-logic error (caught and isolated)', {
                requestId,
                error: logicError.message,
                userMessage: userMessage.substring(0, 50)
            });

            // Set fallback response - frontend will still get valid JSON
            backendLogicResponse = null;
        }

        // ========================================================================
        // STAGE 3: STANDARDIZE RESPONSE (Guarantee API Contract)
        // ========================================================================

        /**
         * Why standardize: 
         * - Backend-logic may return partial/invalid data
         * - Frontend expects exact shape
         * - This guarantees frontend never crashes due to missing fields
         */

        const safeResponse = standardizeResponse(backendLogicResponse);

        // ========================================================================
        // STAGE 4: RETURN SUCCESS (Always HTTP 200 for logic flow)
        // ========================================================================

        /**
         * Why always return 200 for logic responses:
         * - Frontend treats 4xx/5xx as system errors (shows error UI)
         * - Logic failures should show chat message, not error page
         * - Use escalated: true + appropriate reply to signal issues
         * 
         * HTTP Status Guide:
         * - 400: Bad user input (validation failed)
         * - 200: Valid request processed (even if logic failed internally)
         */

        res.status(200).json(safeResponse);

    } catch (unexpectedError) {
        // ========================================================================
        // STAGE 5: CATASTROPHIC ERROR HANDLER (Last Resort)
        // ========================================================================

        /**
         * This should NEVER execute in production. 
         * If it does, something is fundamentally broken in backend-core itself.
         * 
         * Still return 200 to keep frontend stable.
         */

        logger.error('Catastrophic backend-core error', {
            requestId,
            error: unexpectedError.message,
            stack: unexpectedError.stack
        });

        // Even in catastrophic failure, return valid API contract
        res.status(200).json({
            reply: API_CONTRACT.FALLBACK_REPLY,
            escalated: API_CONTRACT.FALLBACK_ESCALATED,
            confidence: API_CONTRACT.FALLBACK_CONFIDENCE
        });
    }
});

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

/**
 * Used by monitoring tools and load balancers
 * Simple check that server is responsive
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'backend-core',
        timestamp: new Date().toISOString()
    });
});

// ============================================================================
// ROOT ENDPOINT (API Documentation)
// ============================================================================

app.get('/', (req, res) => {
    res.json({
        service: 'Backend-Core API Gateway',
        version: 'Phase 5 - Frontend/Backend Sync',
        endpoints: {
            chat: {
                method: 'POST',
                path: '/chat',
                body: { message: 'string' },
                response: {
                    reply: 'string',
                    escalated: 'boolean',
                    confidence: 'number'
                }
            },
            health: {
                method: 'GET',
                path: '/health'
            }
        }
    });
});

// ============================================================================
// GLOBAL ERROR HANDLER (Safety Net)
// ============================================================================

/**
 * Catches any unhandled errors in routes
 * Prevents server crashes
 * Returns valid API contract even in failure
 */
app.use((err, req, res, next) => {
    logger.error('Unhandled route error', {
        requestId: req.requestId,
        error: err.message,
        path: req.path
    });

    // Return valid response even for unexpected errors
    res.status(200).json({
        reply: API_CONTRACT.FALLBACK_REPLY,
        escalated: API_CONTRACT.FALLBACK_ESCALATED,
        confidence: API_CONTRACT.FALLBACK_CONFIDENCE
    });
});

// ============================================================================
// PROCESS ERROR HANDLERS (Prevent Crashes)
// ============================================================================

/**
 * Last line of defense against crashes
 * Logs errors but keeps server running
 */
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {
        error: error.message,
        stack: error.stack
    });
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', {
        reason: String(reason)
    });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 BACKEND-CORE:  API Gateway');
    console.log('========================================');
    console.log('Phase:  5 - Frontend/Backend Sync');
    console.log('Port:', PORT);
    console.log('URL:  http://localhost:' + PORT);
    console.log('\nAPI Contract Enforced:');
    console.log('  { reply, escalated, confidence }');
    console.log('\nSafety Features:');
    console.log('  ✓ Request traceability (X-Request-ID)');
    console.log('  ✓ Response standardization');
    console.log('  ✓ Error isolation');
    console.log('  ✓ Frontend crash prevention');
    console.log('\nStatus:  ✓ Ready for frontend integration');
    console.log('========================================\n');
});