const express = require('express');
const path = require('path');
const app = express();

// Hostinger's environment provides the port automatically
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// A simple API endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: "Online",
        message: "Your Node.js app is running perfectly on Hostinger!",
        timestamp: new Date().toISOString()
    });
});

// Handle all other requests by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
