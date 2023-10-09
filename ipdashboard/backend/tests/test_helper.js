const Stock = require('../models/stock');

const initialStocks = [
    {
        tickerSymbol: '$SCC',
        price: 36.00,
    },
    {
        tickerSymbol: '$MER',
        price: 250.00
    }
];

const nonExistingId = async () => {
    const stock = new Stock({
        tickerSymbol: '$REMOVE_THIS_SOON'
    });
    await stock.save();
    await stock.deleteOne();

    return stock._id.toString();
};

const stocksInDb = async () => {
    const stocks = await Stock.find({});
    return stocks.map(stock => stock.toJSON());
};

module.exports = {
    initialStocks, nonExistingId, stocksInDb
};