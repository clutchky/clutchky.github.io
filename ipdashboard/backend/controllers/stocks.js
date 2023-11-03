const stocksRouter = require('express').Router();
const Stock = require('../models/stock');
const User = require('../models/user');

stocksRouter.get('/', async (request, response) => {

    const stocks = await Stock.find({});
    response.json(stocks);

});

stocksRouter.get('/:id', async (request, response) => {

    const stock = await Stock.findById(request.params.id);

    if (stock) {
        response.json(stock);
    } else {
        response.status(404).end();
    }
});

// add a stockquote
stocksRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findById(body.userId);

    const stock = new Stock({
        tickerSymbol: body.tickerSymbol,
        price: body.price || 0,
        user: user.id
    });

    const savedStock = await stock.save();
    user.stocks = user.stocks.concat(savedStock._id);
    await user.save();

    response.status(201).json(savedStock);

});

// delete a single stockquote
stocksRouter.delete('/:id', async (request, response) => {
    await Stock.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

// update a stockquote
stocksRouter.put('/:id', async (request, response) => {

    const { tickerSymbol, price } = request.body;

    const updatedStock = await Stock.findByIdAndUpdate(
        request.params.id,
        { tickerSymbol, price },
        { new: true, runValidators: true, context: 'query' }
    );

    response.json(updatedStock);

});

module.exports = stocksRouter;