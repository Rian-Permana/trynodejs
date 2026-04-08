const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/prices', async (req, res) => {
    try {
        // 1. Get BTC in USDT from Binance
        const btcRes = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        
        // 2. Get USDT to IDR (Using a stable exchange rate API)
        // Note: In production, you might use a specific IDR exchange API
        const idrRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const usdtToIdr = idrRes.data.rates.IDR;

        res.json({
            btc_usdt: parseFloat(btcRes.data.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            usdt_idr: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(usdtToIdr),
            updatedAt: new Date().toLocaleString('id-ID')
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch market data" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
