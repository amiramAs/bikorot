const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const colors = require('colors');
const dotenv = require('dotenv');
const schedule_config = require('./schedule_config')
const session_config = require('./session_config')
const db_config = require('./db_config')
const mail_config = require('./mail_config')

const app = express();

app.use(express.urlencoded({
    extended: false
}));
app.use(express.text());
app.use(express.json());
app.use(express.text({ type: 'text/html' }))
app.use(express.static('./dist'));
app.use(express.static('./dist/js'));
app.use(express.static('./dist/css'));
app.use(express.static('./dist/reset-pass.js'));

dotenv.config();
const transporter = mail_config()
schedule_config()
session_config(app)

let collection=null;
let schedule=null;

(async () => {
    try {
      let db = await db_config();
      collection = db.collection('students');
      schedule = db.collection('scheduling');
    } catch (error) {
      console.log(error);
    }
  })();

app.use((req, res, next) => {
    req.collection = collection;
    req.schedule = schedule;
    next();
});

app.post('/forget-pass', async (req, res) => {
    try {
        const student = await collection.findOne({ email: req.body.email })
        const token = jwt.sign({ _id: student._id }, process.env.RESETE_PASS_KEY, { expiresIn: '30m' })

        transporter.sendMail({
            from: '"ניהול אתר ביקורות" <process.env.EMAIL>',
            to: student.email,
            subject: 'איפוס סיסמה',
            html: "<h2>הכנס לקישור כדי לאפס את הסיסמה שלך לאתר:</h2></br>" + process.env.CLIENT_URL + 'forget-pass/?resetLink=' + token
        })
            .then(_ => { console.log(("Email sent on " + new Date() + "to " + student.email).inverse.blue) })
            .catch(error => { console.log(error) });

        await collection.updateOne({ _id: student._id }, { $set: { resetLink: token } })

        res.status(200).json({ message: "ok" })
    } catch (e) {
        res.json({ error: e.message })
    }
});

app.get('/forget-pass/', async (req, res) => {
    res.send('<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script><link rel="stylesheet" href="' + process.env.CLIENT_URL + 'public/style.css"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<div id="app"><input type="password" v-model="pass" placeholder="הכנס סיסמה" /><input type="password" v-model="passAgain" placeholder="הכנס סיסמה שוב" /><button v-on:click="send(pass, passAgain,resetLink)">אפס סיסמה</button></div>' +
        '<script src="' + process.env.CLIENT_URL + 'public/reset-pass.js"></script>')
});

app.get('/public/style.css', (req, res) => {
    res.type('.css');
    res.sendFile(__dirname + '/dist/style.css')
})

app.get('/public/reset-pass.js', (req, res) => {
    res.type('.js');
    res.sendFile(__dirname + '/dist/reset-pass.js')
})

app.put('/reset-password', async (req, res) => {
    const { pass, resetLink } = req.body;
    try {
        const decoded = jwt.verify(resetLink, process.env.RESETE_PASS_KEY)
        const salt = await bcrypt.genSalt(15);
        let password = await bcrypt.hash(pass, salt)
            .catch(error => {
                console.log("Error saving user: " + error.message);
            });
        await collection.updateOne({ _id: decoded._id }, { $set: { password: password } })
        res.status(200).json({ message: "ok" })
    } catch (e) {
        res.json({ error: e.message })
    }
})

app.get('/out-number', async (req, res) => {
    if (req.session.student) {
        let out = await collection.find({ out: true }).toArray();
        res.json(out.length);
    }
});

app.get('/chek', async (req, res) => {
    try {
        if (req.session.student) {
            let student = await collection.findOne({ _id: req.session.student._id });

            if (student.out === true) {
                await collection.updateOne({ _id: student._id }, { $set: { out: false } })
                req.session.student.out = false;
                res.status(200).json({ message: 'ok' });
            } else {
                let out = await collection.find({ out: true }).toArray();
                if (out.length >= process.env.OUT) {
                    res.status(200).json({ message: 'too much outside' });
                } else {

                    let outList = await schedule.find({ done: false }).toArray();

                    let now = new Date(Date.now());
                    now.setSeconds(0);
                    now.setMilliseconds(0);
                    if (now.getMinutes() > 52 || now.getMinutes() <= 7) {
                        now.setMinutes(0)
                    } else if (now.getMinutes() > 7 && now.getMinutes() <= 22) {
                        now.setMinutes(15)
                    } else if (now.getMinutes() > 22 && now.getMinutes() <= 37) {
                        now.setMinutes(30)
                    } else if (now.getMinutes() > 37 && now.getMinutes() <= 52) {
                        now.setMinutes(45)
                    }

                    let i = new Date(now)
                    let count = 0;
                    let last = null;
                    let date = null;

                    while (i < new Date().setDate(now.getDate() + 7)) {
                        count = 0;
                        last = null;
                        date = null;
                        outList.forEach((element) => {
                            if (element.departureTime < i && element.entryTime > i) {
                                count++;
                                last = element._id;
                                date = element.departureTime;
                            }
                        })
                        if (count >= process.env.OUT) {
                            i = new Date().setDate(now.getDate() + 7);
                        } else {
                            i.setMinutes(i.getMinutes() + 15)
                        }
                    }
                    if (count >= process.env.OUT) {
                        await collection.updateOne({ _id: req.session.student._id }, { $set: { out: true } })
                        await schedule.updateOne({ _id: last }, { $set: { take_out: req.session.student._id } })
                        res.json({ message: 'Limited out', date: date });
                    } else {
                        await collection.updateOne({ _id: req.session.student._id }, { $set: { out: true } })
                        req.session.student.out = true;
                        res.status(200).json({ message: 'ok' });
                    }
                }
            }
        } else {
            res.redirect('/login');
        }
    } catch (e) {
        console.log(e)
    }
});


const schedule_routes = require('./routes/schedule')
const student_routes = require('./routes/student')

app.use('/schedule', schedule_routes)
app.use('/student', student_routes)

app.listen(process.env.PORT || 8080, () => {
    console.log("The server listening...".inverse.green);
})