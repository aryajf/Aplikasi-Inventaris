import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "404" */ '@/components/errors/404.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Auth/Login.vue'),
    beforeEnter: (to, from, next) => {
      if(store.getters['auth/authenticated']){
        return next({
          name : 'Home'
        })
      }
      next()
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated']){
        return next({
          name : 'Login'
        })
      }
      next()
    },
  },
  {
    path: '/barang/create',
    name: 'Create Barang',
    component: () => import(/* webpackChunkName: "barang" */ '../views/Barang/Create.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated'] || store.getters['auth/user'].role != 'Asisten'){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

export default router