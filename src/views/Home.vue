<template>
  <div class="home" v-if="this.$store.state.login === true">
    <button
      class="chekButton"
      v-if="this.$store.state.userLogin.out === false"
      v-on:click="chek()"
    >
      אני יוצא מהישיבה
    </button>
    <button
      class="chekButton"
      v-else-if="this.$store.state.userLogin.out === true"
      v-on:click="chek()"
    >
      אני חוזר לישיבה
    </button>
    <label class="labelDate">תאריך ושעת יציאה:</label>
    <input
      type="datetime-local"
      class="dateInput"
      v-model="date.departureTime"
    />
    <label class="labelDate">תאריך ושעת חזרה:</label>
    <input type="datetime-local" class="dateInput" v-model="date.entryTime" />

    <button class="dateSend" v-on:click="sendDate(date)">תיזמון יציאה</button>
    <router-link class="list" to="/schedulesList">יציאות מתוכננות</router-link>
  </div>
</template>

<script>
import Hebcal from "hebcal";
export default {
  name: "home",
  data() {
    return {
      date: { departureTime: new Date(), entryTime: new Date() },
    };
  },

  methods: {
    chek() {
      this.menuBar = "noResponsive";
      fetch("/chek").then(async (response) => {
        response = await response.json();
        if (response.message === "too much outside") {
          window.alert("אתה לא יכול לצאת, תחכה שיתפנה מקום או שתפנה לאחראי");
        } else if (response.message === "Limited out") {
          window.alert(
            "היציאה נרשמה עד לתאריך " +
              new Hebcal.HDate(new Date(response.date)).toString("h") +
              " בשעה " +
              new Date(response.date).getHours() +
              ":" +
              new Date(response.date).getMinutes()
          );
          this.$store.state.userLogin.out = true;
        } else if (response.message === "ok") {
          if (this.$store.state.userLogin.out === false) {
            this.$store.state.userLogin.out = true;
          } else if (this.$store.state.userLogin.out === true) {
            this.$store.state.userLogin.out = false;
          }
        }
      });
    },
    sendDate(date) {
      try {
        if (date.departureTime > date.entryTime) {
          window.alert("תאריך היציאה אחרי תאריך החזרה");
        } else if (date.departureTime > new Date()) {
          window.alert("תאריך היציאה כבר היה");
        } else if (date.departureTime === date.entryTime) {
          window.alert("תאריך היציאה והחזרה שווים");
        } else {
          fetch("/schedule", {
            body: JSON.stringify(date),
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(async (response) => {
            response = await response.json();
            if (response === "ok!") {
              window.alert("היציאה נרשמה במערכת");
            } else if (response === "other out in time for student") {
              window.alert("יש לך כבר יציאה בתאריך והשעה הנבחרים");
            } else {
              window.alert(
                "יש יותר מדי יציאות מתוכננות בתאריך " +
                  new Hebcal.HDate(new Date(response)).toString("h") +
                  " בשעה " +
                  new Date(response).getHours() +
                  ":" +
                  new Date(response).getMinutes()
              );
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style>
.home {
  margin-top: 120px;
}

.dateInput,
.dateSend,
.list {
  width: 40%;
  display: block;
  margin-right: 10%;
}

.list {
  font-size: 20px;
  font-family: Assistant;
  border-radius: 4px;
  margin-top: 3%;
  padding-top: 1%;
  padding-bottom: 1%;
  background-color: #00b4d8;
  border: none;
  color: white;
  text-decoration: none;
}

.chekButton {
  display: flow-root;
  position: fixed;
  width: 20%;
  aspect-ratio: 1/1;
  margin-right: 63%;
  margin-top: 3.3em;
  border-radius: 50%;
  padding-right: 4%;
  padding-left: 4%;
  font-size: 1.3em;
  font-weight: 700;
  background-color: #90e0ef;
  color: #0096c7;
}

.labelDate {
  text-align: right;
  margin-right: 10%;
  margin-top: 2%;
  display: block;
}
@media screen and (max-width: 600px) {
  .chekButton {
    display: block;
    position: static;
    width: 50%;
    aspect-ratio: 1 / 1;
    margin-right: 25%;
    margin-top: 110px;
    margin-bottom: 5%;
    padding-right: 12%;
    padding-left: 12%;
    font-size: 1.3em;
    font-weight: bold;
    text-align: center;
  }
  .dateInput,
  .dateSend,
  .list {
    width: 80%;
  }
}
@media screen and (max-width: 750px) and (min-width: 600px) {
  .chekButton {
    margin-right: 42.5%;
    margin-top: 8%;
    font-size: 105%;
  }
  .home {
    margin-top: 10%;
  }
}
</style>