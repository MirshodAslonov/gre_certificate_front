import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/RegisterFromBot.vue';
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Paket from '@/views/Paket.vue';

const routes = [
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/paket',
    name: 'paket',
    component: Paket,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
