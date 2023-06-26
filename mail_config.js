const mailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

module.exports= () => {
    return mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    }, (error) => {
        console.log(error.message)
    });
}