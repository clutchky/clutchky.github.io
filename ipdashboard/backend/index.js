const express = require('express');
const app = express();

app.use(express.json());

let stocks = [
    {
        id: 1,
        tickerSymbol: '$SCC',
        price: 33.00
    },
    {
        id: 2,
        tickerSymbol: '$JFC',
        price: 157.00
    },
    {
        id: 3,
        tickerSymbol: '$GLO',
        price: 2401.00
    },
    {
        id: 4,
        tickerSymbol: '$TEST',
        price: 401.00
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/stocks', (request, response) => {
    response.json(stocks);
});

// fetches a single stockquote
app.get('/api/stocks/:id', (request, response) => {
    const id = Number(request.params.id);
    const stock = stocks.find(stock => stock.id === id)
    
    if (stock) {
        response.json(stock);
    } else {
        response.status(404).end();
    }
});

// delete a single stockquote
app.delete('/api/stocks/:id', (request, response) => {
    const id = Number(request.params.id);
    stocks = stocks.filter(stock => stock.id !== id);
    response.status(204).end();
});

const generateId = () => {
    const maxId = stocks.length > 0
        ? Math.max(...stocks.map(s => s.id))
        : 0;
    return maxId + 1;
}

// add a stockquote
app.post('/api/stocks', (request, response) => {
    const body = request.body;

    if (!body.tickerSymbol) {
        return response.status(400).json({
            error: 'ticker missing'
        })
    }

    const stock = {
        tickerSymbol: body.tickerSymbol,
        price: body.price || 0,
        id: generateId(),
    }

    stocks = stocks.concat(stock);

    response.json(stock);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})