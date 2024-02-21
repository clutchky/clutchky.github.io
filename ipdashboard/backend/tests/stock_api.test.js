const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const Stock = require('../models/stock');
const User = require('../models/user');

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
    beforeEach( async () => {
        await User.deleteMany({});

        const testUser = await helper.testUser();
        await testUser.save();
    });

    test('fails without a token', async () => {

        const newUser = {
            'username': 'testuser',
            'password': 'testpasswords'
        };

        await api
            .post('/api/login')
            .send(newUser)
            .expect(401);

    });

    test('succeeds with valid data', async () => {

        const token = await helper.testUserToken();

        const newStock = {
            tickerSymbol: '$NEW',
            price: 1.00
        };

        await api
            .post('/api/stocks')
            .send(newStock)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const stocksAtEnd = await helper.stocksInDb();
        expect(stocksAtEnd).toHaveLength(helper.initialStocks.length + 1);

        const tickerSymbols = stocksAtEnd.map(r => r.tickerSymbol);
        expect(tickerSymbols).toContain('$NEW');
    });

    test('without a stock symbol cannot be added', async () => {

        const token = await helper.testUserToken();

        const newStock = {
            price: 0
        };

        await api
            .post('/api/stocks')
            .send(newStock)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);

        const stocksAtEnd = await helper.stocksInDb();

        expect(stocksAtEnd).toHaveLength(helper.initialStocks.length);
    });

    test('a stock without a price defaults to 0', async () => {

        const token = await helper.testUserToken();

        const newStock = {
            tickerSymbol: '$NOPRICE'
        };

        await api
            .post('/api/stocks')
            .send(newStock)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const stocksAtEnd = await helper.stocksInDb();

        expect(stocksAtEnd[2].price).toBe(0);

    });
});

describe('deleting a stock', () => {
    beforeEach( async () => {
        // add a test user that creates a stock with token
        await User.deleteMany({});

        const testUser = await helper.testUser();
        await testUser.save();

        // add a test stock to delete
        await Stock.deleteMany({});
        const testStock = await helper.stockWithToken();

        await testStock.save();
    });

    test('succeeds with status code 204 if id is valid', async () => {
        const testStocks = await Stock.find({});
        const stockToRemove = testStocks[0];

        const token = await helper.testUserToken();

        await api
            .delete(`/api/stocks/${stockToRemove._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);

        const stocksAtEnd = await helper.stocksInDb();

        expect(stocksAtEnd).toHaveLength(
            testStocks.length - 1
        );

        const stocks = stocksAtEnd.map(r => r.tickerSymbol);

        expect(stocks).not.toContain(stockToRemove.tickerSymbol);
    });
});

describe('updating a stock', () => {
    test('succeeds if data is valid', async () => {
        const stocksAtStart = await helper.stocksInDb();

        const newData = {
            price: '11.00'
        };

        const stockToUpdate = stocksAtStart[0];

        await api
            .put(`/api/stocks/${stockToUpdate.id}`)
            .send(newData)
            .expect(200);

        const stocksAtEnd = await helper.stocksInDb();

        expect(stocksAtEnd[0].price).toBe(11);
    });
});

// User tests
describe('there is one user in the database and', () => {
    // clears data from collection and adds one user
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('secret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creating a new one succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'testuser',
            name: 'Test user',
            password: 'admin1234',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('fails creating a user with proper status code and message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'nasabayabasan',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username must be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });

    test('fails if password length is less than 3', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'testuser',
            name: 'Test user',
            password: '',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('password must be at least 3 characters long');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });

    test('fails if username and password is not given', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: '',
            name: 'Test user',
            password: ''
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username and password required');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});