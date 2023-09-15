const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message);
    });

const stockSchema = new mongoose.Schema({
    tickerSymbol: String,
    price: Number
});

stockSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString() // stringifies id object
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Stock', stockSchema);