const stocksRouter = require('express').Router();
const Stock = require('../models/stock');

stocksRouter.get('/', (request, response) => {
    Stock.find({})
        .then(stocks => {
            response.json(stocks);
        })
});

stocksRouter.get('/:id', (request, response) => {
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

// add a stockquote
stocksRouter.post('/', (request, response, next) => {
    const body = request.body;

	const stock = new Stock({
		tickerSymbol: body.tickerSymbol,
		price: body.price || 0
	});

	stock.save()
		.then(addedStock => {
			response.json(addedStock);
		})
		.catch(error => next(error));

});

// delete a single stockquote
stocksRouter.delete('/:id', (request, response, next) => {
	Stock.findByIdAndRemove(request.params.id)
		.then(result => {
			if (!result) {
				response.status(400).send({
					error: 'stock does not exist'
				});
			} else {
				response.status(204).end();
			}
		})
		.catch(error => next(error));

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