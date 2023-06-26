const mongodb = require('mongodb');
const express = require("express");
const router = express.Router();

const roundOff =(time)=>{
    time.setSeconds(0);
    time.setMilliseconds(0);
    if (time.getMinutes() > 52 || time.getMinutes() <= 7) {
        time.setMinutes(0)
    } else if (time.getMinutes() > 7 && time.getMinutes() <= 22) {
        time.setMinutes(15)
    } else if (time.getMinutes() > 22 && time.getMinutes() <= 37) {
        time.setMinutes(30)
    } else if (time.getMinutes() > 37 && time.getMinutes() <= 52) {
        time.setMinutes(45)
    }

    return time;
}

router.post('/', async(req, res) => {
    if (req.session.student) {

        let departureTime = new Date(req.body.departureTime);
        let entryTime = new Date(req.body.entryTime);
        let outList = await req.schedule.find({ done: false }).toArray();
        let i = new Date(req.body.departureTime);
        let stop = {
            break: false,
            i: i
        };

        departureTime = roundOff(departureTime)
        entryTime = roundOff(entryTime)
        i = roundOff(i)

        while (entryTime > i) {
            let count = 0;
            for await (const element of outList) {
                if (element.user_id === req.session.student._id && element.departureTime <= i && element.entryTime >= i) {
                    stop.break = true;
                    stop.i = "other out in time for student";
                    i = entryTime;
                }
                if (element.departureTime < i && element.entryTime > i) {
                    count++;
                }
                if (count === process.env.OUT) {
                    stop.break = true;
                    stop.i = i;
                    i = entryTime;
                }
            }
            i.setMinutes(i.getMinutes() + 15);
        }

        if (stop.break) {
            res.status(200).json(stop.i)
        } else {
            await req.schedule.insertOne({ user_id: req.session.student._id, userName: req.session.student.userName, done: false, departureTime: departureTime, entryTime: entryTime });
            res.status(200).json("ok!");
        }
    } else {
        res.redirect('/login');
    }
})

router.get('/', async(req, res) => {
    if (req.session.student) {
        let outList = await req.schedule.find({ done: false, userName: req.session.student.userName }).toArray();
        res.json(outList);
    } else {
        res.redirect('/login');
    }
});

router.delete('/', async(req, res) => {
    if (req.session.student) {
        try {
            await req.schedule.deleteOne({ _id: new mongodb.ObjectID(req.body._id) });
            res.status(200).json('ok');
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    } else {
        res.redirect('/login');
    }
})

module.exports = router;
