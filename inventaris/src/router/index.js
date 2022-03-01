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
    path: '/lab',
    name: 'Semua Lab',
    component: () => import(/* webpackChunkName: "Semua Lab" */ '../views/Lab/Lab.vue'),
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
    path: '/lab/:type',
    name: 'Show Lab',
    component: () => import(/* webpackChunkName: "Show Lab" */ '../views/Lab/Show.vue'),
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
    path: '/category',
    name: 'List Category',
    component: () => import(/* webpackChunkName: "category" */ '../views/Category/Category.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated']){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
  {
    path: '/category/edit/:id',
    name: 'Update Category',
    component: () => import(/* webpackChunkName: "category" */ '../views/Category/Update.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated'] || store.getters['auth/user'].role != 'Asisten'){
        return next({
          name : 'not-found'
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
  {
    path: '/barang/edit/:slug',
    name: 'Update Barang',
    component: () => import(/* webpackChunkName: "barang" */ '../views/Barang/Update.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated'] || store.getters['auth/user'].role != 'Asisten'){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
  {
    path: '/barang/:slug',
    name: 'Show Barang',
    component: () => import(/* webpackChunkName: "barang" */ '../views/Barang/Show.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated']){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
  {
    path: '/user',
    name: 'List User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/User.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated'] || store.getters['auth/user'].role != 'Admin'){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
  {
    path: '/user/create',
    name: 'Create User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Create.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated'] || store.getters['auth/user'].role != 'Admin'){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
  {
    path: '/user/update',
    name: 'Update User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Update.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated'] || store.getters['auth/user'].role != 'Admin'){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
  {
    path: '/user/:id',
    name: 'Show User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Show.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated'] || store.getters['auth/user'].role != 'Admin'){
        return next({
          name : 'not-found'
        })
      }
      next()
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Profile" */ '../views/auth/Profile.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated']){
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