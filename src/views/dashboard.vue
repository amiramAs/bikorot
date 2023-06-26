<template>
  <div
    class="dashboard"
    v-if="
      this.$store.state.login && this.$store.state.userLogin.degree === 'admin'
    "
  >
    <router-link to="/new">הוסף תלמיד חדש</router-link>
    <router-link to="/deleteUser">מחק תלמיד</router-link>
    <router-link to="/students-admin">עריכת תלמידים</router-link>
  </div>
</template>
<script>
export default {
  name: "dashboard",
};
</script>
<style>
.dashboard {
  padding-top: 10px;
}
.dashboard a {
  width: 80%;
  border-radius: 4px;
  margin-top: 2%;
  padding-top: 1%;
  padding-bottom: 1%;
  background-color: #00b4d8;
  color: #fff;
  display: block;
  margin-right: 10%;
  text-decoration: none;
}
@media screen and (max-width: 750px) {
  .admin a {
    display: flex;
    width: 20%;
    aspect-ratio: 1 / 1;
  }
  .admin {
    display: flex;
  }
}
</style>