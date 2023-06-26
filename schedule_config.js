const cron = require('node-cron');
const db_config = require('./db_config')

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

module.exports= () => {
    cron.schedule('*/15 * * * *', async () => {
        
        let date = new Date();
        date.setSeconds(0);
        date.setMilliseconds(0);

        let scheduling = await schedule.find({ done: false, departureTime: new Date(date) }).toArray();
        scheduling.forEach(async element => {
            if (element.take_out != null) {
                let out = await collection.findOne({ _id: element.take_out })
                await collection.updateOne({ _id: element.take_out }, { $set: { out: false } })
                console.log((out.userName + " חזר בעקבות יציאה מתוזמנת של " + element.userName));
            }
            await collection.findOneAndUpdate({ userName: element.userName }, { $set: { out: true } });
            console.log((element.userName + " יצא ביציאה מתוזמנת"));
        })
        scheduling = await schedule.find({ done: false, entryTime: new Date(date) }).toArray();
        scheduling.forEach(async element => {
            await collection.findOneAndUpdate({ userName: element.userName }, { $set: { out: false } });
            await schedule.findOneAndUpdate({ userName: element.userName }, { $set: { done: true } });
            console.log((element.userName + " חזר ביציאה מתוזמנת"));

        })

    });
}