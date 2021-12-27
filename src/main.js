import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import store from './store'
import Home from './components/Home'

Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    component: Home
  }
  ]
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
