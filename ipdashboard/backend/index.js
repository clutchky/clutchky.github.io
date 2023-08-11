const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.static('build'));

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    });
}

app.use(express.json());
app.use(cors());

// custom morgan token showing the request.body
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
})

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ');
}));
app.use(requestLogger);

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
    response.send('<h1>Investment Portfolio Dashboard</h1>');
});

app.get('/info', (request, response) => {
    const requestTime = new Date();
    response.send(
        `<p>Stocks analyzed: ${stocks.length}</p>
        <p>${requestTime}</p>
        `
    );
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
        response.status(404).send('Stock not found').end();
    }
});

// delete a single stockquote
app.delete('/api/stocks/:id', (request, response) => {
    const id = Number(request.params.id);
    stocks = stocks.filter(stock => stock.id !== id);
    response.status(204).end();
});

// temporary id generator
const generateId = () => { // subject to change
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

    const stockTickers = stocks.map(s => s.tickerSymbol);

    // check if stock is already added
    if (stockTickers.includes(body.tickerSymbol)) {
        return response.status(400).json({
            error: 'stock already exists'
        })
    }

    const stock = {
        tickerSymbol: body.tickerSymbol,
        price: body.price || 0, // default price is set to 0
        id: generateId(),
    }

    stocks = stocks.concat(stock); // add stock to stock list

    response.json(stock);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});