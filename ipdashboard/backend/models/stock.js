const mongoose = require('mongoose');

const financialDataSchema = new mongoose.Schema({
    year: {
        type: String,
        default: '2023'
    },
    salesRevenue: {
        type: Number,
        default: 0
    }
});

const stockSchema = new mongoose.Schema({
    companyName: {
        type: String,
        default: ''
    },
    tickerSymbol: {
        type: String,
        minLength: 2,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    financialData: {
        type: [financialDataSchema],
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

stockSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // stringifies id object
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Stock', stockSchema);