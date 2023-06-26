const mongodb = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

module.exports = async () => {
    try {
        const url = process.env.MONGO_URI;
        const connection = await mongodb.connect(url);
        const db = connection.db('ynirdb');
        return db
    } catch (e) {
        console.log(e)
    }
}