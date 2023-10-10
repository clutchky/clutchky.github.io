const stocksRouter = require('express').Router();
const Stock = require('../models/stock');

stocksRouter.get('/', async (request, response) => {

    const stocks = await Stock.find({});
    response.json(stocks);

});

stocksRouter.get('/:id', async (request, response, next) => {

    try {
        const stock = await Stock.findById(request.params.id);

        if (stock) {
            response.json(stock);
        } else {
            response.status(404).end();
        }
    } catch (exception) {
        next(exception);
    }
});

// add a stockquote
stocksRouter.post('/', async (request, response, next) => {
    const body = request.body;

    const stock = new Stock({
        tickerSymbol: body.tickerSymbol,
        price: body.price || 0
    });

    try {
        const savedStock = await stock.save();
        response.status(201).json(savedStock);
    } catch (exception) {
        next(exception);
    }

});

// delete a single stockquote
stocksRouter.delete('/:id', async (request, response, next) => {
    try {
        await Stock.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } catch (exception) {
        next(exception);
    }

});

// update a stockquote
stocksRouter.put('/:id', (request, response, next) => {
    const { tickerSymbol, price } = request.body;

    Stock.findByIdAndUpdate(
        request.params.id,
        { tickerSymbol, price },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedStock => {
            response.json(updatedStock);
        })
        .catch(error => next(error));
});

module.exports = stocksRouter;