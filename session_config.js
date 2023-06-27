const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.SECRET)

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
