import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import("../views/Dashboard.vue")
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },

  {
    path: "/help",
    name: "Help",
    component: () => import("../views/Help.vue")
  },
  {
    path: "/events/:firestoreId/:usermail",
    name: "Böme",
    component: () => import("../views/Live.vue")
  },


]

const router = createRouter({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
