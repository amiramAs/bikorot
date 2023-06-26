<template>
  <div class="changePassword" v-if="this.$store.state.login===true">
    <input
      type="password"
      v-model="password.oldPassword"
      placeholder="סיסמה ישנה"
    />
    <input
      type="password"
      v-model="password.newPassword1"
      placeholder="סיסמה חדשה"
    />
    <input
      type="password"
      v-model="password.newPassword2"
      placeholder="הכנס שוב סיסמה"
    />
    <br />
    <button v-on:click="changePassword()">שנה סיסמה</button>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",
  data() {
    return {
      password: {},
    };
  },
  methods: {
    changePassword(password) {
      if (this.password.newPassword1 === this.password.newPassword2) {
        fetch("/student/change-password", {
          body: JSON.stringify(this.password),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(async (response) => {
            const data = await response.text();
            if (data === "ok") {
              window.alert("הסיסמה שונתה בהצלחה");
            } else if (data === "oldPasswordError") {
              window.alert("סיסמה ישנה לא נכונה");
            }
          })
          .catch((error) => console.error(error));
      } else {
        window.alert("שני הסיסמאות לא תואמות");
      }
    },
  },
};
</script>

<style>
</style>