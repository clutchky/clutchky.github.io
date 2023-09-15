require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Stock = require('./models/stock');

const app = express();
app.use(express.static('build'));

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('---');
    next();
};

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

app.get('/', (request, response) => { // overwritten by 'build' folder
    response.send('<h1>Investment Portfolio Dashboard</h1>');
});

app.get('/info', (request, response) => {
    const requestTime = new Date();

    Stock.find({})
        .then(stocks => {
            response.send(
                `<p>Stocks analyzed: ${stocks.length}</p>
                <p>${requestTime}</p>
                `
            )
        })
});

app.get('/api/stocks', (request, response) => {
    Stock.find({}).then(stocks => {
        response.json(stocks);
    })
})

// fetches a single stockquote
app.get('/api/stocks/:id', (request, response, next) => {
    Stock.findById(request.params.id)
        .then(stock => {
            if (stock) {
                response.json(stock);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            next(error);
        });
});

// delete a single stockquote
app.delete('/api/stocks/:id', (request, response, next) => {
    Stock.findByIdAndRemove(request.params.id)
        .then(result => {
            if (!result) {
                response.status(400).send({
                    error: 'stock does not exist'
                })
            } else {
                response.status(204).end();
            }
        })
        .catch(error => next(error));
});

// temporary id generator
const generateId = () => { // subject to change
    const maxId = stocks.length > 0
        ? Math.max(...stocks.map(s => s.id))
        : 0;
    return maxId + 1;
}

// update a stockquote
app.put('/api/stocks/:id', (request, response, next) => {
    const body = request.body;

    const stock = {
        tickerSymbol: body.tickerSymbol,
        price: body.price
    }

    Stock.findByIdAndUpdate(request.params.id, stock, { new: true })
        .then(updatedStock => {
            response.json(updatedStock);
        })
        .catch(error => next(error));
})

// add a stockquote
app.post('/api/stocks', (request, response) => {
    const body = request.body;

    if (!body.tickerSymbol) {
        return response.status(400).json({
            error: 'ticker missing'
        })
    }

    const stock = new Stock({
        tickerSymbol: body.tickerSymbol,
        price: body.price || 0, // default price is set to 0
    });

    stock.save()
        .then(addedStock => {
            response.json(addedStock);
        })

    // const stockTickers = stocks.map(s => s.tickerSymbol);

    // check if stock is already added
    // if (stockTickers.includes(body.tickerSymbol)) {
    //     return response.status(400).json({
    //         error: 'stock already exists'
    //     })
    // }

});

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    });
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        });
    }

    next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});