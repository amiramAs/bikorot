const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (app) => {
    app.use(session({
        secret: process.env.secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            student: {}
        }
    }));
}