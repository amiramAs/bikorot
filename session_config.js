const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (app) => {
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            student: {}
        }
    }));
}
