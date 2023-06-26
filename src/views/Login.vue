<template>
  <div class="login">
    <input type="text" v-model="user.userName" placeholder="שם משתמש" />
    <input type="password" v-model="user.password" placeholder="סיסמה" /><br />
    <!-- <label for="remember">זכור אותי</label>
    <input
      type="checkbox"
      v-model="user.remember"
      class="checkbox"
      checked
    /><br /> -->
    <button v-on:click="login(user)">התחבר</button>
    <br />
    <router-link to="/forget-pass">שכחת סיסמה?</router-link>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      user: {},
    };
  },
  methods: {
    login(user) {
      try {
        fetch("/student/log-in ", {
          body: JSON.stringify(user),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          if ((await response.text()) === "user name or password error") {
            window.alert("שם משתמש או סיסמה לא נכונים");
          } else {
            fetch("/student/chekLogin", {
              method: "POST",
            })
              .then((response) => response.json())
              .then((data) => {
                this.$store.commit("login", data);
              });
            this.$router.push({ path: "/", name: "Home" });
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>