const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Hostinger uses a dynamic port
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/prices', async (req, res) => {
    try {
        // 1. Fetch Bitcoin Price in USDT from Binance
        const btcResponse = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        
        // 2. Fetch USDT to IDR exchange rate
        const idrResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const usdtToIdr = idrResponse.data.rates.IDR;

        res.json({
            btc_usdt: parseFloat(btcResponse.data.price).toLocaleString('en-US', { 
                style: 'currency', 
                currency: 'USD' 
            }),
            usdt_idr: new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR',
                minimumFractionDigits: 2
            }).format(usdtToIdr),
            updatedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        });
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ error: "Failed to fetch live market data" });
    }
});

// Serve the index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
