<template>
  <div class="studentsAdmin" v-if="this.$store.state.login === true">
    <div>
      <input
        type="text"
        id="number"
        class="searchInput"
        v-model="studentName"
        v-on:change="loadone()"
        placeholder="הכנס שם / שם משתמש"
      />
      <button type="button" class="searchButton" v-on:click="loadone()">
        <img src="../assets/icons8-search.svg" alt="🔍" height="20px" />
      </button>
    </div>

    <div v-if="student != ''">
      <div class="divTable paleBlueRows" id="adminTable">
        <div class="divTableHeading">
          <div class="divTableRow">
            <div class="divTableHead noMobile">שם משתמש</div>
            <div class="divTableHead">שם</div>
            <div class="divTableHead">אימייל</div>
            <div class="divTableHead">שיעור</div>
            <div class="divTableHead">נוכחות</div>
            <div class="divTableHead noMobile">מנהל</div>
            <div class="divTableHead noMobile">מחיקה</div>
            <div class="divTableHead noMobile">עריכה</div>
            <div class="divTableHead onlyMobile"></div>
          </div>
        </div>
        <div class="divTableBody">
          <div
            class="divTableRow"
            v-if="editStudent === student._id && editMobile === null"
          >
            <div class="divTableCell">
              <input
                type="text"
                v-model="student.userName"
                placeholder="שם משתמש"
                required
              />
            </div>
            <div class="divTableCell">
              <input
                type="text"
                v-model="student.firstName"
                placeholder="שם פרטי"
                required
              /><input
                type="text"
                v-model="student.lastName"
                placeholder="שם משפחה"
                required
              />
            </div>
            <div class="divTableCell">
              <input
                type="email"
                v-model="student.email"
                placeholder="אימייל"
                required
              />
            </div>
            <div class="divTableCell">
              <select v-model="student.shiur" required>
                <option selected disabled>שיעור</option>
                <option value="א">א</option>
                <option value="ב">ב</option>
                <option value="ג">ג</option>
                <option value="ד">ד</option>
                <option value="ה">ה</option>
                <option value="ו">ו ומעלה</option>
              </select>
            </div>
            <div class="divTableCell">
              <input
                type="radio"
                id="out"
                class="radio"
                v-model="student.out"
                value="מחוץ לישיבה"
                required
              />
              <label for="out">בחוץ</label>
              <input
                type="radio"
                id="noOut"
                class="radio"
                v-model="student.out"
                value="בישיבה"
              />
              <label for="noOut">בישיבה</label>
            </div>
            <div class="divTableCell">
              <input
                type="checkbox"
                id="admin"
                class="remember"
                v-model="student.degree"
              />
            </div>
            <div
              class="divTableCell divButton"
              v-on:click="deleteStudent(student._id, i)"
            >
              <img src="../assets/crossed.png" height="23px" />
            </div>
            <div
              class="divTableCell divButton"
              v-on:click="updateStudent(student)"
            >
              שמירה
            </div>
          </div>
          <div class="divTableRow" v-else>
            <div class="divTableCell noMobile">{{ student.userName }}</div>
            <div class="divTableCell">
              {{ student.firstName }} {{ student.lastName }}
            </div>
            <div class="divTableCell">
              {{ student.email }}
            </div>
            <div class="divTableCell">{{ student.shiur }}</div>
            <div class="divTableCell">{{ student.out }}</div>
            <div class="divTableCell noMobile" v-if="student.degree === true">
              מנהל
            </div>
            <div
              class="divTableCell divButtonNoMobile"
              v-if="student.degree === false"
              v-on:click="toAdmin(student._id)"
            >
              הפוך למנהל
            </div>
            <div
              class="divTableCell divButtonNoMobile"
              v-on:click="deleteStudent(student._id, i)"
            >
              <img src="../assets/crossed.png" height="23px" />
            </div>
            <div
              class="divTableCell divButtonNoMobile"
              v-on:click="editStudent = student._id"
            >
              עריכה
            </div>
            <div
              class="divTableCell onlyMobile"
              v-on:click="editMobile = student"
            >
              <img src="../assets/arrow.png" height="23px" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="student === ''">
      <div class="divTable paleBlueRows" id="adminTable">
        <div class="divTableHeading">
          <div class="divTableRow">
            <div class="divTableHead noMobile">שם משתמש</div>
            <div class="divTableHead">שם</div>
            <div class="divTableHead">אימייל</div>
            <div class="divTableHead">שיעור</div>
            <div class="divTableHead">נוכחות</div>
            <div class="divTableHead noMobile">מנהל</div>
            <div class="divTableHead noMobile">מחיקה</div>
            <div class="divTableHead noMobile">עריכה</div>
            <div class="divTableHead onlyMobile"></div>
          </div>
        </div>
        <div class="divTableBody">
          <div
            class="divTableRow"
            v-for="(student, i) in students"
            :key="student._id"
          >
            <div
              class="divTableCell"
              v-show="editStudent === student._id && editMobile === null"
            >
              <input
                type="text"
                v-model="student.userName"
                placeholder="שם משתמש"
                required
              />
            </div>
            <div
              class="divTableCell"
              v-show="editStudent === student._id && editMobile === null"
            >
              <input
                type="text"
                v-model="student.firstName"
                placeholder="שם פרטי"
                required
              /><input
                type="text"
                v-model="student.lastName"
                placeholder="שם משפחה"
                required
              />
            </div>
            <div
              class="divTableCell"
              v-show="editStudent === student._id && editMobile === null"
            >
              <input
                type="email"
                v-model="student.email"
                placeholder="אימייל"
                required
              />
            </div>
            <div
              class="divTableCell"
              v-show="editStudent === student._id && editMobile === null"
            >
              <select v-model="student.shiur" required>
                <option selected disabled>שיעור</option>
                <option value="א">א</option>
                <option value="ב">ב</option>
                <option value="ג">ג</option>
                <option value="ד">ד</option>
                <option value="ה">ה</option>
                <option value="ו">ו ומעלה</option>
              </select>
            </div>
            <div
              class="divTableCell"
              v-show="editStudent === student._id && editMobile === null"
            >
              <input
                type="radio"
                id="out"
                class="radio"
                v-model="student.out"
                value="מחוץ לישיבה"
                required
              />
              <label for="out">בחוץ</label>
              <input
                type="radio"
                id="noOut"
                class="radio"
                v-model="student.out"
                value="בישיבה"
              />
              <label for="noOut">בישיבה</label>
            </div>
            <div
              class="divTableCell"
              v-show="editStudent === student._id && editMobile === null"
            >
              <input
                type="checkbox"
                id="admin"
                class="remember"
                v-model="student.degree"
              />
            </div>
            <div
              class="divTableCell divButton"
              v-show="editStudent === student._id && editMobile === null"
              v-on:click="deleteStudent(student._id, i)"
            >
              <img src="../assets/crossed.png" height="23px" />
            </div>
            <div
              class="divTableCell divButton"
              v-show="editStudent === student._id && editMobile === null"
              v-on:click="updateStudent(student)"
            >
              שמירה
            </div>

            <div
              class="divTableCell noMobile"
              v-show="editStudent != student._id"
            >
              {{ student.userName }}
            </div>
            <div class="divTableCell" v-show="editStudent != student._id">
              {{ student.firstName }} {{ student.lastName }}
            </div>
            <div class="divTableCell" v-show="editStudent != student._id">
              {{ student.email }}
            </div>
            <div class="divTableCell" v-show="editStudent != student._id">
              {{ student.shiur }}
            </div>
            <div class="divTableCell" v-show="editStudent != student._id">
              {{ student.out }}
            </div>
            <div
              class="divTableCell noMobile"
              v-show="editStudent != student._id"
              v-if="student.degree === true"
            >
              מנהל
            </div>
            <div
              class="divTableCell divButtonNoMobile"
              v-if="student.degree === false"
              v-on:click="toAdmin(student._id)"
              v-show="editStudent != student._id"
            >
              הפוך למנהל
            </div>
            <div
              class="divTableCell divButtonNoMobile"
              v-show="editStudent != student._id"
              v-on:click="deleteStudent(student._id, i)"
            >
              <img src="../assets/crossed.png" height="23px" />
            </div>
            <div
              class="divTableCell divButtonNoMobile"
              v-show="editStudent != student._id"
              v-on:click="editStudent = student._id"
            >
              עריכה
            </div>
            <div
              class="divTableCell onlyMobile"
              v-on:click="editMobile = student"
            >
              <img src="../assets/arrow.png" height="23px" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="studentEditMobile" v-if="editMobile != null">
      <div class="studentHeader">
        <button v-on:click="editMobile = null" class="exit">
          <img src="../assets/‏‏arrow back.png" height="23px" />
        </button>
      </div>
      <span v-if="editStudent != editMobile._id"
        >שם משתמש: {{ editMobile.userName }}</span
      >
      <span v-if="editStudent != editMobile._id"
        >שם: {{ editMobile.firstName }} {{ editMobile.lastName }}</span
      >
      <span v-if="editStudent != editMobile._id">
        אימייל: {{ editMobile.email }}</span
      >
      <span v-if="editStudent != editMobile._id"
        >שיעור: {{ editMobile.shiur }}</span
      >
      <span v-if="editStudent != editMobile._id"
        >נוכחות: {{ editMobile.out }}</span
      >
      <span v-if="editStudent != editMobile._id && editMobile.degree === true"
        >מנהל</span
      >
      <span
        v-if="editMobile.degree === false && editStudent != editMobile._id"
        v-on:click="toAdmin(editMobile._id)"
      >
        הפוך למנהל
      </span>
      <span
        v-if="editStudent != editMobile._id"
        v-on:click="deleteStudent(editMobile._id, i)"
      >
        <img src="../assets/crossed.png" height="23px" />
      </span>
      <span
        v-if="editStudent != editMobile._id"
        v-on:click="editStudent = editMobile._id"
        >עריכה</span
      >

      <span v-if="editStudent === editMobile._id">
        <input
          type="text"
          v-model="editMobile.userName"
          placeholder="שם משתמש"
          required
        />
      </span>
      <span v-if="editStudent === editMobile._id">
        <input
          type="text"
          v-model="editMobile.firstName"
          placeholder="שם פרטי"
          required
        />
      </span>
      <span v-if="editStudent === editMobile._id">
        <input
          type="text"
          v-model="editMobile.lastName"
          placeholder="שם משפחה"
          required
        />
      </span>
      <span v-if="editStudent === editMobile._id">
        <input
          type="email"
          v-model="editMobile.email"
          placeholder="אימייל"
          required
        />
      </span>
      <span v-if="editStudent === editMobile._id">
        <select v-model="editMobile.shiur" required>
          <option selected disabled>שיעור</option>
          <option value="א">א</option>
          <option value="ב">ב</option>
          <option value="ג">ג</option>
          <option value="ד">ד</option>
          <option value="ה">ה</option>
          <option value="ו">ו ומעלה</option>
        </select>
      </span>
      <span v-if="editStudent === editMobile._id">
        <input
          type="radio"
          class="radio"
          v-model="editMobile.out"
          value="מחוץ לישיבה"
          required
        />
        <label for="out">בחוץ</label>
        <input
          type="radio"
          class="radio"
          v-model="editMobile.out"
          value="בישיבה"
        />
        <label for="noOut">בישיבה</label>
      </span>
      <span v-if="editStudent === editMobile._id">
        <label>מנהל?</label>
        <input
          type="checkbox"
          id="admin"
          class="remember"
          v-model="editMobile.degree"
        />
      </span>
      <span
        v-if="editStudent === editMobile._id"
        v-on:click="deleteStudent(editMobile._id)"
      >
        <img src="../assets/crossed.png" height="23px" />
      </span>
      <span
        v-if="editStudent === editMobile._id"
        v-on:click="updateStudent(editMobile)"
      >
        שמירה
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "studentsAdmin",
  data() {
    return {
      number: "",
      students: "",
      student: "",
      editStudent: null,
      editMobile: null,
      studentName: "",
    };
  },

  computed: {
    evenNumbers() {
      return this.students.filter(function (students) {
        return students.out === "מחוץ לישיבה";
      });
    },

    fetchStudents() {
      fetch("/student")
        .then((response) => response.json())
        .then((data) => {
          this.students = data;
          this.students.forEach((element) => {
            if (element.out) {
              element.out = "מחוץ לישיבה";
            } else {
              element.out = "בישיבה";
            }
          });
        });
    },

    fetchNumber() {
      fetch("/out-number")
        .then((response) => response.json())
        .then((data) => {
          this.number = data;
        });
    },
  },
  methods: {
    deleteStudent(id, i) {
      fetch("/student/", {
        body: '{"id":' + id + "}",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        this.students.splice(i, 1);
      });
    },

    updateStudent(student) {
      fetch("/out-number")
        .then((response) => response.json())
        .then((data) => {
          this.number = data;
        });
      if (this.number >= 4 && student.out === "מחוץ לישיבה") {
        window.alert("יש יותר מדי תלמידים בחוץ, אי אפשר לעדכן את המשתמש");
      } else {
        if (student.out === "מחוץ לישיבה") {
          student.out = true;
        } else {
          if (student.out === "בישיבה") {
            student.out = false;
          }
        }
        if (student.degree === true) {
          student.degree = "admin";
        } else {
          student.degree = undefined;
        }
        fetch("/student/" + student._id, {
          body: JSON.stringify(student),
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(() => {
          this.editStudent = null;
        });

        if (student.out === true) {
          student.out = "מחוץ לישיבה";
        } else if (student.out === false) {
          student.out = "בישיבה";
        }
        if (student.degree === "admin") {
          student.degree = true;
        } else {
          student.degree = false;
        }
      }
    },

    toAdmin(studentId) {
      fetch("/student/toAdmin/" + studentId, {
        method: "POST",
      }).then(() => {
        fetch("/student")
          .then((response) => response.json())
          .then((data) => {
            this.students = data;
            this.students.forEach((element) => {
              if (element.out) element.out = "מחוץ לישיבה";
              else element.out = "בישיבה";
              if (element.degree === "admin") {
                element.degree = true;
              } else {
                element.degree = false;
              }
            });
          });
      });
    },

    loadone() {
      if (this.studentName != "") {
        this.students.forEach((element) => {
          if (
            element.firstName === this.studentName ||
            element.lastName === this.studentName ||
            element.firstName + " " + element.lastName === this.studentName ||
            element.userName === this.studentName
          ) {
            this.student = element;
          }
        });
      } else {
        this.student = "";
      }
    },
  },
  
  mounted() {
    fetch("/student")
      .then((response) => response.json())
      .then((data) => {
        this.students = data;
        this.students.forEach((element) => {
          if (element.out) element.out = "מחוץ לישיבה";
          else element.out = "בישיבה";
          if (element.degree === "admin") element.degree = true;
          else element.degree = false;
        });
      })
      .catch((error) => console.error(error));
    fetch("/out-number")
      .then((response) => response.json())
      .then((data) => {
        this.number = data;
      })
      .catch((error) => console.error(error));
  },
};
</script>

<style>
div.divButton:hover,
div.divButtonNoMobile:hover {
  background: #00b4d8;
  color: #fff;
}
div.noMobile,
div.divButtonNoMobile {
  display: table-cell;
}

.onlyMobile,
.studentEditMobile {
  display: none;
}

.searchButton {
  width: 5%;
  margin-right: 10px;
}

.searchInput {
  width: 74%;
}

@media screen and (max-width: 600px) {
  div.noMobile,
  div.divButtonNoMobile {
    display: none;
  }

  #adminTable .onlyMobile {
    display: table-cell;
    width: 10%;
    vertical-align: middle;
  }
  #adminTable .divTableCell,
  #adminTable .divTableHead,
  #adminTable .divButtonNoMobile,
  #adminTable .noMobile {
    width: 30%;
  }
  .studentEditMobile,
  #newStudent {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: rgba(202, 240, 248, 0.9);
    padding-top: 2.5%;
    display: block;
  }

  .studentEditMobile span,
  #newStudent div {
    border: 3px solid #90e0ef;
    padding: 2.5%;
    width: 80%;
    margin-right: 10%;
    margin-top: -3px;
    display: flow-root;
  }

  .studentEditMobile span input,
  .studentEditMobile span select,
  #newStudent div input,
  #newStudent div select {
    padding: 0px;
    background: none;
    width: auto;
  }

  .studentHeader {
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
  }

  .exit {
    width: 30px;
    margin-right: 16px;
    margin-top: 12px;
    margin-bottom: 30px;
    background-color: transparent;
    display: flow-root;
  }

  .exit:hover {
    background-color: #00b4d8;
  }
}
</style>