import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(Vue2TouchEvents, {
    swipeTolerance: 25,
    longTapTimeInterval: 300
});

const store = new Vuex.Store({
    state: {
        login: false,
        userLogin: {}

    },
    mutations: {
        login(state, userLogin) {
            state.login = true;
            state.userLogin = userLogin;
        },
        logout(state) {
            state.login = false;
            state.userLogin = {};
        },
    },
})

new Vue({
    router,
    store: store,
    render: function(h) { return h(App) }
}).$mount('#app')