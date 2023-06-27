const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.secret)

module.exports = (app) => {
    app.use(session({
        secret: "nkn39bs",
        resave: false,
        saveUninitialized: true,
        cookie: {
            student: {}
        }
    }));
}
