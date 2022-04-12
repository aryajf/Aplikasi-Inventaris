import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: () => import(/* webpackChunkName: "404" */ '@/components/errors/404.vue'),
    beforeEnter: () => {
      window.scrollTo(0, 0)
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Auth/Login.vue'),
    beforeEnter: (to, from, next) => authenticated(next)
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "Profile" */ '../views/auth/Profile.vue'),
    beforeEnter: (to, from, next) => notAuthenticated(next)
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    beforeEnter: (to, from, next) => notAuthenticated(next)
  },
  {
    path: '/lab',
    name: 'Lab',
    component: () => import(/* webpackChunkName: "Lab" */ '../views/Lab/Lab.vue'),
    beforeEnter: (to, from, next) => notAuthenticated(next)
  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "History" */ '../views/History/History.vue'),
    beforeEnter: (to, from, next) => notAuthenticated(next)
  },
  {
    path: '/category',
    name: 'List Category',
    component: () => import(/* webpackChunkName: "category" */ '../views/Category/Category.vue'),
    beforeEnter: (to, from, next) => notAuthenticated(next)
  },
  {
    path: '/category/edit/:id',
    name: 'Update Category',
    component: () => import(/* webpackChunkName: "category" */ '../views/Category/Update.vue'),
    beforeEnter: (to, from, next) => Asisten(next)
  },
  {
    path: '/barang/create',
    name: 'Create Barang',
    component: () => import(/* webpackChunkName: "barang" */ '../views/Barang/Create.vue'),
    beforeEnter: (to, from, next) => Asisten(next)
  },
  {
    path: '/barang/edit/:id',
    name: 'Update Barang',
    component: () => import(/* webpackChunkName: "barang" */ '../views/Barang/Update.vue'),
    beforeEnter: (to, from, next) => Asisten(next)
  },
  {
    path: '/barang/:id',
    name: 'Show Barang',
    component: () => import(/* webpackChunkName: "barang" */ '../views/Barang/Show.vue'),
    beforeEnter: (to, from, next) => notAuthenticated(next)
  },
  {
    path: '/user',
    name: 'List User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/User.vue'),
    beforeEnter: (to, from, next) => Admin(next)
  },
  {
    path: '/user/create',
    name: 'Create User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Create.vue'),
    beforeEnter: (to, from, next) => Admin(next)
  },
  {
    path: '/user/:id',
    name: 'Show User',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Show.vue'),
    beforeEnter: (to, from, next) => Admin(next)
  },
]

const notAuthenticated = (next) => {
  window.scrollTo(0, 0)
  if (!store.getters['auth/authenticated']) {
      return next({
          name: 'Login'
      })
  }
  next()
}


const authenticated = (next) => {
  window.scrollTo(0, 0)
  if (store.getters['auth/authenticated']) {
      return next({
          name: 'Home'
      })
  }
  next()
}

const validateRole = (role, next) => {
  window.scrollTo(0, 0)
  return ((store.getters['auth/authenticated']) && (store.getters['auth/authenticated'].role == role)) ? next() : next({name: 'Not Found'})
}

const validateMultipleRole = (next, role1, role2, role3, role4) => {
  window.scrollTo(0, 0)
  return ((store.getters['auth/authenticated']) && (store.getters['auth/authenticated'].role == role1 || store.getters['auth/authenticated'].role == role2 || store.getters['auth/authenticated'].role == role3 || store.getters['auth/authenticated'].role == role4)) ? next() : next({name: 'Not Found'})
}

const Admin = (next) => validateRole('Admin', next)
const Asisten = (next) => validateMultipleRole(next, 'Dasar', 'Menengah', 'Lanjut')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

export default router