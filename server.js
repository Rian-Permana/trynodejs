const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Mapping Binance symbols to friendly names
const cryptoMap = {
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'USDTUSDC': 'Tether (Stable)',
    'BNBUSDT': 'Binance Coin',
    'XRPUSDT': 'Ripple'
};

app.get('/api/market', async (req, res) => {
    try {
        const symbols = Object.keys(cryptoMap);
        // Binance batch price endpoint
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbols=["${symbols.join('","')}"]`);
        
        const data = response.data.map(item => ({
            name: cryptoMap[item.symbol],
            symbol: item.symbol.replace('USDT', '').replace('USDC', ''),
            price: parseFloat(item.price).toLocaleString('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: item.symbol.includes('USDTUSDC') ? 4 : 2 
            }),
        }));

        res.json({ assets: data, updatedAt: new Date().toLocaleTimeString() });
    } catch (error) {
        res.status(500).json({ error: "API limit reached or service down" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Dashboard active on port ${PORT}`));
