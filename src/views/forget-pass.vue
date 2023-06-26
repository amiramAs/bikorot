<template>
  <div class="forget-pass">
    <input type="email" v-model="email" placeholder="הכנס אימייל" />
    <button v-on:click="resetPass(email)">אפס סיסמה</button>
  </div>
</template>

<script>
export default {
  name: "forget-pass",
  data() {
    return {
      email: null,
    };
  },
  methods: {
    resetPass(email) {
      fetch("/forget-pass", {
        body: JSON.stringify({ email }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "ok") {
            window.alert("כעת נשלח לחשבון האימייל שלך קישור לשחזור הסיסמה");
          } else if (
            data.error === "Cannot read properties of null (reading '_id')"
          ) {
            window.alert(
              "לא נמצא משתמש האימייל שהכנסת"
            );
          } else {
            window.alert(
              "לא הצלחנו לשלוח לך אימייל, נסה שוב בהמשך/n" + data.error
            );
          }
        });
    },
  },
};
</script>

<style>
</style>