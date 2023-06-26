const express = require("express");
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const generateId = () => {
    const maxId = stocks.length > 0 
    ? Math.max(...stocks.map(n => n.id))
    : 0;

    return maxId + 1;
}

let stocks = [
    {
        id: 1,
        tickerSymbol: "MER",
        price: 275.00,
    },
    {
        id: 2,
        tickerSymbol: "CLI",
        price: 2.61,
    },
    {
        id: 3,
        tickerSymbol: "SCC",
        price: 30.00,
    },
    {
        id: 4,
        tickerSymbol: "DITO",
        price: 5.00
    }
]

app.get('/', (request, response) => {
    response.send("<h1>Investment Portfolio Dashboard</h1>");
})

app.get('/api/stocks', (request, response) => {
    response.json(stocks)
})

app.get('/api/stocks/:id', (request, response) => {
    const id = Number(request.params.id);
    const stock = stocks.find(stock => stock.id === id);

    if (stock) {
        response.json(stock);
    } else {
        response.status(400).send("Stock data not found in portfolio");
    }
    
})

app.post('/api/stocks', (request, response) => {
    const body = request.body;

    if (!body.tickerSymbol) {
        return response.status(400).json({
            error: "content missing"
        });
    }

    const stock = {
        tickerSymbol: body.tickerSymbol,
        price: body.price,
        id: generateId(),
    }

    stocks = stocks.concat(stock);

    response.json(stock);
})

app.delete('/api/stocks/:id', (request, response) => {
    const id = Number(request.params.id);
    stocks = stocks.filter(stock => stock.id !== id);

    response.status(204).end();
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})