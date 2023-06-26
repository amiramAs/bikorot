const express = require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        if (req.session.student) {
            let students = await req.collection.find({}).toArray();
            if (req.session.student.degree != 'admin') {
                students.forEach(element => {
                    element.password = undefined;
                    element.degree = undefined;
                    element._id = undefined;
                    element.userName = undefined;
                });
            } else {
                students.forEach(element => {
                    element.password = undefined;
                });

            }
            res.send(students);
        } else {
            res.redirect('/login');
        }
    } catch (e) {
        console.log(e)
        res.send(e);
    }
});

router.get('/:id', async(req, res) => {
    try {
        if (req.session.student) {
            let student = await req.collection.findOne({ _id: +req.params.id });
            if (req.session.student.degree != 'admin') {
                student.password = undefined;
                student.degree = undefined;
                student._id = undefined;
                student.userName = undefined;

            } else {
                student.password = undefined;
            }
            res.send(student);
        } else {
            res.redirect('/login');
        }
    } catch (e) {
        res.send(e);
    }
});

router.post('/log-in', async(req, res) => {
    let student = await req.collection.findOne({ userName: req.body.userName });
    const validPassword = await bcrypt.compare(req.body.password, student.password);
    if (validPassword) {
        student.password = null;
        req.session.student = student;
        res.status(200).send('ok');
    } else {
        res.send('user name or password error');

    }
});

router.post('/', async(req, res) => {
    if (req.session.student) {
        if (req.session.student.degree === 'admin') {
            try {

                let student = req.body;

                const { _id: maxId } = await req.collection.find({})
                    .sort({ _id: -1 })
                    .next();

                student._id = maxId + 1;
                student.out = false;
                if (student.degree === true) {
                    student.degree = "admin";
                } else {
                    student.degree = null;
                }

                const salt = await bcrypt.genSalt(15);
                student.password = await bcrypt.hash(student.password, salt)
                    .catch(error => {
                        console.log("Error saving user: " + error);
                        res.end()
                    });

                await req.collection.insertOne(student);
                console.log('new user: ');
                console.log(student)
                res.status(200).send('ok');

            } catch (e) {
                console.log(e);
                res.end();
            }
        } else {
            res.send("אין לך הרשאות לביצוע התהליך")
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/change-password', async(req, res) => {
    if (req.session.student) {
        let student = await req.collection.findOne({ _id: req.session.student._id });
        const validPassword = await bcrypt.compare(req.body.oldPassword, student.password);
        const salt = await bcrypt.genSalt(15);
        if (validPassword) {
            let password = await bcrypt.hash(req.body.newPassword1, salt)
                .catch(error => {
                    console.log("Error saving user: " + error);
                });
            await req.collection.updateOne({ _id: student._id }, { $set: { password: password } })
            res.status(200).send('ok');
        } else {
            res.send('oldPasswordError');
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/log-out', (req, res) => {
    try {
        req.session.destroy();
        res.end();
    } catch (e) {
        res.send(e);
    }
});

router.delete('/', async(req, res) => {
    if (req.session.student) {
        if (req.session.student.degree === 'admin') {
            try {
                const studentDelete = await req.collection.findOne({ $or: [{ _id: +req.body.id }, { userName: req.body.userName }] });
                await req.collection.deleteOne({ _id: studentDelete._id });
                res.status(200).send('ok');
            } catch {
                res.send("שם משתמש לא נמצא");
            }
        } else {
            res.send("אין לך הרשאות לביצוע התהליך")
        }
    } else {
        res.redirect('/login');
    }
});

router.put('/:id', async(req, res) => {
    if (req.session.student) {
        if (req.session.student.degree === 'admin') {
            try {
                await req.collection.findOneAndUpdate({ _id: +req.params.id }, { $set: { firstName: req.body.firstName, lastName: req.body.lastName, userName: req.body.userName, shiur: req.body.shiur, out: req.body.out, degree: req.body.degree } });
                res.status(200).json("ok!");
            } catch {
                res.send("שם משתמש לא נמצא");
            }
        } else {
            res.send("אין לך הרשאות לביצוע התהליך")
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/toAdmin/:id', async(req, res) => {
    if (req.session.student) {
        if (req.session.student.degree === 'admin') {
            try {
                await req.collection.findOneAndUpdate({ _id: +req.params.id }, { $set: { degree: 'admin' } });
                res.status(200).json("ok!");
            } catch {
                res.send("שם משתמש לא נמצא");
            }
        } else {
            res.send("אין לך הרשאות לביצוע התהליך")
        }
    } else {
        res.redirect('/login');
    }
})

router.post('/chekLogin', async (req, res) => {
    if (req.session.student) {
        req.session.student = await req.collection.findOne({ _id: req.session.student._id });
        res.json(req.session.student);
    } else {
        res.json('false');
    }
})

module.exports = router;