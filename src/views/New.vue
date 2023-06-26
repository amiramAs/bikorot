<template>
  <div class="new" v-if="this.$store.state.login === true">
    <input
      type="text"
      v-model="student.firstName"
      name="firstName"
      placeholder="שם פרטי"
      required
    />
    <input
      type="text"
      v-model="student.lastName"
      name="lastName"
      placeholder="שם משפחה"
      required
    />
    <input
      type="text"
      v-model="student.userName"
      name="userName"
      placeholder="שם משתמש"
      required
    />
    <input
      type="password"
      v-model="student.password"
      name="password"
      id="password1"
      placeholder="סיסמה"
      required
    />
    <input
      type="password"
      v-model="passwordAgain"
      name="passwordAgain"
      id="password2"
      placeholder="הכנס שוב סיסמה"
      required
    />
    <input
      type="email"
      v-model="student.email"
      placeholder="אימייל"
      required
    />
    <select v-model="student.shiur" name="shiur" required>
      <option selected disabled>שיעור</option>
      <option value="א">א</option>
      <option value="ב">ב</option>
      <option value="ג">ג</option>
      <option value="ד">ד</option>
      <option value="ה">ה</option>
      <option value="ו">ו ומעלה</option>
    </select>
    <br />
    <input
      type="checkbox"
      v-model="student.degree"
      id="admin"
      class="checkbox"
    />
    <label for="admin">מנהל</label>
    <br />
    <button v-on:click="newStudent(student)">הוסף תלמיד</button>
  </div>
</template>

<script>
export default {
  name: "new",
  data() {
    return {
      student: {},
      passwordAgain: null
    };
  },
  methods: {
    newStudent(student) {
      if (this.student.password != this.passwordAgain) {
        window.alert("שני הסיסמאות אינם תואמות");
      } else if (!this.student.userName) {
        window.alert("שם משתמש ריק");
      } else if (!this.student.firstName) {
        window.alert("שם פרטי ריק");
      } else if (!this.student.lastName) {
        window.alert("שם משפחה ריק");
      } else if (!this.student.email) {
        window.alert("אימייל ריק");
      } else {
        try {
          fetch("/student ", {
            body: JSON.stringify(student),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(async (response) => {
            if ((await response.text()) === "ok") {
              window.alert("המשתמש " + this.student.userName + " נוצר בהצלחה");
              this.student = {};
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
};
</script>