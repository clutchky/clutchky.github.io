const stocksRouter = require('express').Router();
const Stock = require('../models/stock');
const { userExtractor } = require('../utils/middleware');

stocksRouter.get('/', async (request, response) => {

    const stocks = await Stock
        .find({}).populate('user', { username: 1, name: 1 });
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
stocksRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body;

    const user = request.user;

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
stocksRouter.delete('/:id', userExtractor, async (request, response) => {

    const user = request.user;

    const stockToDelete = await Stock.findById(request.params.id);

    if (user._id.toString() === stockToDelete.user.toString()) {
        await Stock.findByIdAndRemove(request.params.id);

        response.status(204).end();
    } else {
        return response.status(401).json({
            error: 'cannot delete stocks of other users'
        });
    }

});

// update a stockquote
stocksRouter.put('/:id', userExtractor, async (request, response) => {

    const user = request.user;

    const stockToUpdate = await Stock.findById(request.params.id);

    const { tickerSymbol, price } = request.body;

    if (user._id.toString() === stockToUpdate.user.toString()) {
        const updatedStock = await Stock.findByIdAndUpdate(
            request.params.id,
            { tickerSymbol, price },
            { new: true, runValidators: true, context: 'query' }
        );

        response.json(updatedStock);
    } else {
        return response.status(401).json({
            error: 'cannot update stocks of other users'
        });
    }

});

module.exports = stocksRouter;