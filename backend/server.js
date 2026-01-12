// ============================================================================
// PHASE 1: SERVER SETUP
// ============================================================================

// Import Express framework to create our web server
const express = require('express');
const cors = require('cors');

// Create the Express application instance
// This is the core of our backend server
const app = express();

// Define the port our server will listen on
const PORT = process.env.PORT || 5000;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Enable CORS (Cross-Origin Resource Sharing)
// This allows our frontend (running on a different port) to communicate with this backend
app.use(cors());

// Enable JSON body parsing
// This middleware automatically parses incoming JSON payloads
// and makes them available in req.body
app.use(express.json());

// ============================================================================
// PHASE 4: BACKEND-LOGIC INTEGRATION (BLACK BOX)
// ============================================================================

/**
 * ⚠️ IMPORTANT: This function represents BACKEND-LOGIC (separate layer)
 * 
 * In a real architecture, this would be imported from a separate module: 
 * const { processMessage } = require('./logic/messageProcessor');
 * 
 * Backend-core does NOT know: 
 * - How replies are generated
 * - What rules or datasets are used
 * - Any chatbot intelligence or intent detection
 * 
 * Backend-core ONLY knows:
 * - How to call this function
 * - What format it expects (string message)
 * - What format it returns ({ reply, escalated })
 * 
 * This is a PLACEHOLDER for demonstration purposes.
 * The actual logic will be implemented in backend-logic layer.
 */
function processMessage(message) {
    // PLACEHOLDER: This would be implemented in backend-logic
    // For now, return a static response to demonstrate the flow

    // In the real implementation, this function would:
    // - Analyze the message
    // - Check against knowledge base
    // - Apply business rules
    // - Determine if escalation is needed

    return {
        reply: 'Backend-core Phase 4 complete.  Backend-logic integration working.',
        escalated: false
    };
}

// ============================================================================
// PHASE 2 & 3: API ENDPOINT (NOW WITH PHASE 4 LOGIC DELEGATION)
// ============================================================================

// POST /chat endpoint
// This is where incoming chat requests are received
app.post('/chat', (req, res) => {

    // STEP 1: Read the incoming request body
    // The JSON body is already parsed by express. json() middleware
    const { message } = req.body;

    // STEP 2: Validate the incoming data
    // Check if 'message' exists and is a non-empty string
    if (!message || typeof message !== 'string' || message.trim() === '') {
        // If validation fails, send an error response with status 400 (Bad Request)
        return res.status(400).json({
            error: 'Invalid request:  "message" must be a non-empty string'
        });
    }

    // ============================================================================
    // PHASE 4: DELEGATE TO BACKEND-LOGIC
    // ============================================================================

    try {
        // STEP 3: Call backend-logic to process the message
        // Backend-core does NOT decide what the reply should be
        // It delegates this responsibility to the backend-logic layer
        // Backend-logic is treated as a BLACK BOX - we don't know HOW it works
        const result = processMessage(message);

        // STEP 4: Validate the response from backend-logic
        // Ensure backend-logic returned the expected format
        if (!result || typeof result.reply !== 'string' || typeof result.escalated !== 'boolean') {
            throw new Error('Backend-logic returned invalid format');
        }

        // STEP 5: Send the response from backend-logic to the client
        // Backend-core acts as a pass-through orchestrator
        res.json({
            reply: result.reply,
            escalated: result.escalated
        });

    } catch (error) {
        // STEP 6: Handle any errors from backend-logic
        // If backend-logic fails, return a safe error message
        // and mark as escalated so a human can help
        console.error('Error in backend-logic:', error.message);

        res.status(500).json({
            reply: 'Something went wrong. Please try again.',
            escalated: true
        });
    }

});

// ============================================================================
// START THE SERVER
// ============================================================================

// Start listening on the specified port
// This makes the server active and ready to receive requests
app.listen(PORT, () => {
    console.log(`✅ Backend-core server is running on http://localhost:${PORT}`);
    console.log(`📡 POST /chat endpoint is ready`);
    console.log(`🔌 Backend-logic integration:  Phase 4 complete`);
});