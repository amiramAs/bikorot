<template>
  <div class="outList" v-if="this.$store.state.login === true">
    <div class="divTable paleBlueRows">
      <div class="divTableHeading">
        <div class="divTableRow">
          <div class="divTableHead">תאריך יציאה</div>
          <div class="divTableHead">תאריך חזרה</div>
          <div class="divTableHead">מחיקת יציאה</div>
        </div>
      </div>
      <div class="divTableBody">
        <div class="divTableRow" v-for="(out, i) in list" :key="out.i">
          <div class="divTableCell">
            {{ out.departureTime }}
          </div>
          <div class="divTableCell">{{ out.entryTime }}</div>
          <div class="divTableCell" v-on:click="deleteSchedule(out._id, i)">
            <img src="../assets/crossed.png" height="23px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hebcal from "hebcal";
export default {
  name: "schedulesList",
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    fetch("/schedule")
      .then((response) => response.json())
      .then((data) => {
        this.list = data;
        let i = 0;
        this.list.forEach((element) => {
          element.i = i;
          i++;
          element.departureTime =
            new Hebcal.HDate(new Date(element.departureTime)).toString("h") +
            " בשעה " +
            new Date(element.departureTime).getHours() +
            ":" +
            new Date(element.departureTime).getMinutes();
          element.entryTime =
            new Hebcal.HDate(new Date(element.entryTime)).toString("h") +
            " בשעה " +
            new Date(element.entryTime).getHours() +
            ":" +
            new Date(element.entryTime).getMinutes();
        });
        this.list = data;
      });
  },
  methods: {
    deleteSchedule(_id, i) {
      fetch("/schedule", {
        body: JSON.stringify({_id}),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === "ok") {
            this.list.splice(i, 1);
          } else {
            console.log(data);
          }
        });
    },
  },
};
</script>

<style>
</style>