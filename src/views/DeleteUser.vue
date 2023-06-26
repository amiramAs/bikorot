<template>
  <div v-if="this.$store.state.login===true">
    <input type="text" v-model="user.userName" placeholder="שם משתמש" />
    <button v-on:click="deleteStudent(user)">מחק תלמיד</button>
  </div>
</template>

<script>
export default {
  name: "DeleteUser",
  data() {
    return {
      user: {},
    };
  },
  methods: {
    deleteStudent(user) {
      try {
        fetch("/student", {
          body: JSON.stringify(user),
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (response.status === 200) {
            window.alert("המשתמש " + user.userName + " נמחק בהצלחה");
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style>
</style>