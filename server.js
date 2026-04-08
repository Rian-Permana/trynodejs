const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Route: Get Real-time Bitcoin Price
app.get('/api/bitcoin', async (req, res) => {
    try {
        // Fetching from Binance Public API (No Key Required)
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        res.json({
            symbol: "Bitcoin (BTC)",
            price: parseFloat(response.data.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            updatedAt: new Date().toLocaleTimeString()
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch price" });
    }
});

// Root Route: Explicitly serve index.html to prevent "Nothing Found"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
