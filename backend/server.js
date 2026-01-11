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
// PHASE 2: API ENDPOINT
// ============================================================================

// POST /chat endpoint
// This is where incoming chat requests are received
app.post('/chat', (req, res) => {

    // STEP 1: Read the incoming request body
    // The JSON body is already parsed by express.json() middleware
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
    // PHASE 3: GENERATE BASIC RESPONSE
    // ============================================================================

    // STEP 3: Generate a simple static response
    // NO AI, NO business logic, NO datasets - just a static reply
    const responseData = {
        reply: 'Backend is working correctly',
        escalated: false
    };

    // STEP 4: Send the JSON response back to the client
    // Express will automatically set Content-Type:  application/json
    res.json(responseData);

});

// ============================================================================
// START THE SERVER
// ============================================================================

// Start listening on the specified port
// This makes the server active and ready to receive requests
app.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
    console.log(`📡 POST /chat endpoint is ready`);
});
