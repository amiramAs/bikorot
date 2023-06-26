import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import New from '../views/New.vue'
import ChangePassword from '../views/ChangePassword.vue'
import StudentsAdmin from '../views/StudentsAdmin.vue'
import Login from '../views/Login.vue'
import DeleteUser from '../views/DeleteUser.vue'
import Dashboard from '../views/dashboard.vue'
import SchedulesList from '../views/schedulesList.vue'
import ForgetPass from '../views/forget-pass.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'בית'
        }
    },
    {
        path: '/new',
        name: 'New',
        component: New,
        meta: {
            title: 'הוספת תלמיד חדש'
        }
    },
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: ChangePassword,
        meta: {
            title: 'החלפת סיסמה'
        }
    },
    {
        path: '/students-admin',
        name: 'StudentsAdmin',
        component: StudentsAdmin,
        meta: {
            title: 'ניהול תלמידים'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'התחברות'
        }
    },
    {
        path: '/deleteUser',
        name: 'DeleteUser',
        component: DeleteUser,
        meta: {
            title: 'מחיקת תלמיד'
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            title: 'ניהול אתר'
        }
    },
    {
        path: '/schedulesList',
        name: 'SchedulesList',
        component: SchedulesList,
        meta: {
            title: 'רשימת יציאות'
        }
    },
    {
        path: '/forget-pass',
        name: 'forget-pass',
        component: ForgetPass,
        meta: {
            title: 'שחזר סיסמה'
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router;