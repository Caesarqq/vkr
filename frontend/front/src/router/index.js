import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Auctions from '../views/Auctions.vue';
import AuctionDetail from '../views/AuctionDetail.vue';
import AddLot from '../views/AddLot.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auctions',
    name: 'Auctions',
    component: Auctions
  },
  {
    path: '/auction/:id',
    name: 'AuctionDetail',
    component: AuctionDetail,
    props: true
  },
  {
    path: '/add-lot',
    name: 'AddLot',
    component: AddLot,
    meta: { requiresAuth: true, roles: ['donor'] }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const userRole = store.state.user.role;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/');
  } else {
    next();
  }
});

export default router;