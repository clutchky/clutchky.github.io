const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Stock = require('../models/stock');
const User = require('../models/user');

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

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(users => users.toJSON());
};

// add a testUser
const testUser = async () => {

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({
        username: 'testuser',
        passwordHash,
        name: 'Test User'
    });

    return user;
};

// get testUser token
const testUserToken = async () => {

    const user = await User.find({});

    const userToken = {
        username: user[0].username,
        id: user[0].id
    };

    const token = jwt.sign(userToken, process.env.SECRET, { expiresIn: 60*60 });

    return token;

};

// test stock with token
const stockWithToken = async () => {

    const userId = await User.find({});

    const stockToDelete = new Stock({
        tickerSymbol: '$TST',
        price: 10.00,
        user: userId[0]._id
    });

    return stockToDelete;
};

module.exports = {
    initialStocks,
    nonExistingId,
    stocksInDb,
    usersInDb,
    testUser,
    testUserToken,
    stockWithToken
};