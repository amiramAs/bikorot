<template>
  <div id="app">
    <div v-touch:swipe.left="clickBar">
      <div v-if="this.$store.state.login === true">
        <div class="header" v-bind:id="menuBar">
          <span class="menuButton" v-on:click="clickBar()"
            ><img src="./assets/menu.png" height="20px"
          /></span>
          <div
            class="header-left"
            v-if="this.$store.state.userLogin.out === false"
          >
            {{ this.$store.state.userLogin.firstName }}
            {{ this.$store.state.userLogin.lastName }} מחובר בישיבה
          </div>
          <div
            class="header-left"
            v-else-if="this.$store.state.userLogin.out === true"
          >
            {{ this.$store.state.userLogin.firstName }}
            {{ this.$store.state.userLogin.lastName }} מחובר מחוץ לישיבה
          </div>
          <div class="header-right">
            <router-link to="/" v-on:click.native="menuBar = 'noResponsive'"
              >בית</router-link
            >
            <span
              v-on:click="chek()"
              v-if="this.$store.state.userLogin.out === false"
              >אני יוצא עכשיו</span
            >
            <span
              v-on:click="chek()"
              v-if="this.$store.state.userLogin.out === true"
              >אני חוזר עכשיו</span
            >
            <router-link
              to="/change-password"
              v-on:click.native="menuBar = 'noResponsive'"
              >החלפת סיסמה</router-link
            >
            <router-link
              to="/dashboard"
              v-if="this.$store.state.userLogin.degree === 'admin'"
              v-on:click.native="menuBar = 'noResponsive'"
              >ניהול תלמידים</router-link
            >
            <span v-on:click="logout()">התנתק</span>
          </div>
        </div>
      </div>
      <router-view class="router-view" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuBar: "noResponsive",
    };
  },
  methods: {
    chek() {
      this.menuBar = "noResponsive";
      fetch("/chek").then(async (response) => {
        response = await response.json();
        if (response.message === "too much outside") {
          window.alert("אתה לא יכול לצאת, תחכה שיתפנה מקום או שתפנה לאחראי");
        } else if (response.message === "ok") {
          if (this.$store.state.userLogin.out === false) {
            this.$store.state.userLogin.out = true;
          } else if (this.$store.state.userLogin.out === true) {
            this.$store.state.userLogin.out = false;
          }
        }
      });
    },
    logout() {
      this.menuBar = "noResponsive";
      this.$store.commit("logout");
      fetch("/students/log-out");
      this.$router.push({ path: "/login", name: "Login" });
    },
    clickBar() {
      if (this.menuBar === "noResponsive") {
        this.menuBar = "responsive";
      } else {
        this.menuBar = "noResponsive";
      }
    },
  },
  mounted() {
    fetch("/student/chekLogin", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "false") {
          this.$store.commit("logout");
          this.$router.push({ path: "/login", name: "Login" });
        } else {
          this.$store.commit("login", data);
        }
      });
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        document.title = to.meta.title || "ניהול יציאות ישיבת מעלה נפצוצים";
      },
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  font-family: Assistant;
}

body {
  font-family: Assistant;
  font-size: 1.2em;
  text-align: center;
  background-color: #caf0f8;
  margin: 0;
}

div.paleBlueRows {
  margin-right: 10%;
  margin-left: 10%;
  width: 80%;
  text-align: center;
  border: none;
  margin-top: 3%;
}

.divTable.paleBlueRows .divTableCell,
.divTable.paleBlueRows .divTableHead {
  border: 1px solid #caf0f8;
  width: 33%;
  padding-top: 5px;
  padding-bottom: 5px;
  vertical-align: middle;
}

.divTable.paleBlueRows .divTableRow:nth-child(even) {
  background: #ade8f4;
}

.divTable.paleBlueRows .divTableRow.divTableHead:nth-child(odd) {
  background: #00b4d8;
}

.divTable.paleBlueRows .divTableHeading .divTableHead {
  font-weight: normal;
  text-align: center;
  background: #00b4d8;
  color: white;
}

.divTable {
  display: table;
}

.divTableRow {
  display: table-row;
}

.divTableHeading {
  display: table-header-group;
}

.divTableCell,
.divTableHead {
  display: table-cell;
}

.divTableHeading {
  display: table-header-group;
}

.divTableBody {
  display: table-row-group;
  background: #90e0ef;
}

#adminTable .divTableCell,
#adminTable .divTableHead,
#adminTable .divButtonNoMobile,
#adminTable .noMobile {
  width: 14.28%;
}

.header {
  overflow: hidden;
  background-color: #90e0ef;
  padding: 20px 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  justify-content: space-between;
}

.header a,
span {
  float: right;
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 20px;
  line-height: 25px;
  border-radius: 4px;
}

.admin a {
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 20px;
  line-height: 25px;
  border-radius: 4px;
  margin: 5px;
}

.header span.menuButton {
  display: none;
}

.admin {
  margin-top: 30px;
}

.header a:hover,
.header span:hover,
.admin a {
  background-position: right;
}

.header a,
.header span {
  transition: 0.35s cubic-bezier(0.65, 0.05, 0.36, 1);
  background: linear-gradient(to right, #90e0ef 50%, #48cae4 50%) left;
  background-size: 200% 100%;
}

.header a.active {
  background-color: #00b4d8;
  color: white;
}

button,
input,
select,
option,
#someOut {
  width: 80%;
  font-size: 20px;
  font-family: Assistant;
  border-radius: 4px;
  margin-top: 3%;
  padding-top: 1%;
  padding-bottom: 1%;
}

input,
select {
  background-color: #90e0ef;
  border: none;
}

button,
#submit {
  background-color: #00b4d8;
  border: none;
  color: white;
}

.radio,
.checkbox {
  margin: 2%;
  padding: 2%;
  width: 20px;
}

.router-view {
  margin-top: 100px;
}

.login {
  margin-top: 10%;
}

.header-left {
  float: left;
  display: block;
  padding: 10px 10px;
  font-weight: bold;
}
@media screen and (max-width: 600px) {
  button,
  input,
  select,
  option,
  #someOut {
    padding-top: 3%;
    padding-bottom: 3%;
  }
  button {
    width: 80%;
  }
  #someOut {
    margin-right: 10%;
  }
  .header span.menuButton {
    float: right;
    display: block;
  }

  #noResponsive .header-right {
    display: block;
    opacity: 0;
    height: 0;
    overflow: hidden;
  }

  #responsive {
    height: 100%;
    transition: opacity 1s ease-out;
  }

  #responsive .header-right {
    padding-block-start: 60px;
    opacity: 1;
    height: auto;
  }

  #responsive .header-right a,
  #responsive .header-right span {
    float: none;
    display: flow-root;
    text-align: center;
  }
}

@media screen and (max-width: 750px) and (min-width: 600px) {
  .header {
    width: 185px;
    right: 0;
    background-color: #90e0ef;
    position: fixed;
    height: 100%;
    font-size: 17px;
  }
  .header-left {
    padding: 4px 0px 5px 8px;
    bottom: 0;
    position: absolute;
  }
  .header-right a,
  .header-right span {
    float: none;
    display: flow-root;
    padding: 5%;
  }
  .router-view {
    margin-right: 190px;
    margin-top: 5%;
  }
  .login,
  .forget-pass {
    margin-right: 0%;
    margin-top: 130px;
  }
}
</style>