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

describe('when there are initial stocks saved', () => {
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

    // jestjs format
    test('there are two stocks', async () => {
        const response = await api.get('/api/stocks');

        expect(response.body).toHaveLength(2);
    });

    test('the first stock is $SCC', async () => {
        const response = await api.get('/api/stocks');

        expect(response.body[0].tickerSymbol).toBe('$SCC');
    });

    test('a specific stock is within the returned stocks', async () => {
        const response = await api.get('/api/stocks');

        const tickerSymbols = response.body.map(r => r.tickerSymbol);

        expect(tickerSymbols).toContain('$MER');
    });
});

describe('viewing a specific stock', () => {
    test('succeeds with a valid id', async () => {
        const stocksAtStart = await helper.stocksInDb();

        const stockToView = stocksAtStart[0];

        const resultStock = await api
            .get(`/api/stocks/${stockToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(resultStock.body).toEqual(stockToView);
    });

    test('fails with statuscode 404 if stock does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId();

        await api
            .get(`/api/stocks/${validNonexistingId}`)
            .expect(404);
    });

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5a59070081a82a3445';

        await api
            .get(`/api/stocks/${invalidId}`)
            .expect(400);
    });

    test('unique identifier of a stock is named id', async () => {
        const response = await api.get('/api/stocks');
        const idProperty = Object.keys(response.body[0])[4];

        expect(idProperty).toBeDefined();
    });
});

describe('adding a new stock', () => {
    test('succeeds with valid data', async () => {
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

    test('without a stock symbol cannot be added', async () => {
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
});

describe('deleting a stock', () => {
    test('succeeds with status code 204 if id is valid', async () => {
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
});

afterAll(async () => {
    await mongoose.connection.close();
});