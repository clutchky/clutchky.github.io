const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Stock = require('../models/stock');

beforeEach(async () => {
    await Stock.deleteMany({});
    await Stock.insertMany(helper.initialStocks);
});

// supertest format
test('stocks are returned as json', async () => {
    await api
        .get('/api/stocks')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

//all stocks are returned
test('all stocks are returned', async () => {
    const response = await api.get('/api/stocks');

    expect(response.body).toHaveLength(helper.initialStocks.length);
});

test('a specific stock is within the returned stocks', async () => {
    const response = await api.get('/api/stocks');

    const tickerSymbols = response.body.map(r => r.tickerSymbol);

    expect(tickerSymbols).toContain('$MER');
});

// jestjs format
test('there are two stocks', async () => {
    const response = await api.get('/api/stocks');

    expect(response.body).toHaveLength(2);
});

test('the first stock is $SCC', async () => {
    const response = await api.get('/api/stocks');

    expect(response.body[0].tickerSymbol).toBe('$SCC');
});

test('a valid stock can be added', async () => {
    const newStock = {
        tickerSymbol: '$NEW',
        price: 1.00
    };

    await api
        .post('/api/stocks')
        .send(newStock)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const stocksAtEnd = await helper.stocksInDb();
    expect(stocksAtEnd).toHaveLength(helper.initialStocks.length + 1);

    const tickerSymbols = stocksAtEnd.map(r => r.tickerSymbol);
    expect(tickerSymbols).toContain('$NEW');
});

test('stock without a stock symbol cannot be added', async () => {
    const newStock = {
        price: 0
    };

    await api
        .post('/api/stocks')
        .send(newStock)
        .expect(400);

    const stocksAtEnd = await helper.stocksInDb();

    expect(stocksAtEnd).toHaveLength(helper.initialStocks.length);
});

test('a stock without a price defaults to 0', async () => {
    const newStock = {
        tickerSymbol: '$NOPRICE'
    };

    await api
        .post('/api/stocks')
        .send(newStock)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const stocksAtEnd = await helper.stocksInDb();

    expect(stocksAtEnd[2].price).toBe(0);

});

test('a specific stock can be viewed', async () => {
    const stocksAtStart = await helper.stocksInDb();

    const stockToView = stocksAtStart[0];

    const resultStock = await api
        .get(`/api/stocks/${stockToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(resultStock.body).toEqual(stockToView);
});

test('a stock can be deleted', async () => {
    const stocksAtStart = await helper.stocksInDb();

    const stockToDelete = stocksAtStart[0];

    await api
        .delete(`/api/stocks/${stockToDelete.id}`)
        .expect(204);

    const stocksAtEnd = await helper.stocksInDb();

    expect(stocksAtEnd).toHaveLength(
        helper.initialStocks.length - 1
    );

    const stocks = stocksAtEnd.map(r => r.tickerSymbol);

    expect(stocks).not.toContain(stockToDelete.tickerSymbol);
});

test('unique identifier of a stock is named id', async () => {
    const response = await api.get('/api/stocks');
    const idProperty = Object.keys(response.body[0])[4];

    expect(idProperty).toBeDefined();
});

afterAll(async () => {
    await mongoose.connection.close();
});