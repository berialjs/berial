import Router from 'vue-router'
import Vue from 'vue'
import Home from './pages/Home.vue'
import About from './pages/About.vue'

Vue.use(Router)

export default new Router({
  base: '/vue/',
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/about',
      component: About
    }
  ]
})
