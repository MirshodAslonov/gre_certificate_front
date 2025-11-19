import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/RegisterFromBot.vue';
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Paket from '@/views/Paket.vue';
import Users from '@/views/Users.vue';
import UserDetail from '@/views/GetUser.vue';
import AdminPanel from '@/views/AdminPanel.vue';
import ExpiredUsers from '@/views/ExpiredUsers.vue';
import ActiveUsers from '@/views/ActiveUsers.vue';
import DebtUsers from '@/views/DebtUsers.vue';
import TestPage from '@/views/TestPage.vue';
import SubscriberUsers from '@/views/SubscriberUsers.vue';
import HRUsers from '@/views/HRUsers.vue';
import HrStatusUsers from '@/views/HrStatusUsers.vue';

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
  {
    path: '/admin/users',
    name: 'admin-users',
    component: Users,
  },
  {
  path: '/admin/user/:id',
  name: 'admin-user-detail',
  component: UserDetail,
  },
  {
    path: '/admin/panel',
    name: 'admin-panel',
    component: AdminPanel,
  },
  {
    path: '/expired/users',
    name: 'expired-users',
    component: ExpiredUsers,
  },
  {
    path: '/active/users',
    name: 'active-users',
    component: ActiveUsers,
  },
  {
    path: '/debt/users',
    name: 'debt-users',
    component: DebtUsers,
  },
  {
    path: '/test/page',
    name: 'test-page',
    component: TestPage,
  },
  {
    path: '/subscriber/users',
    name: 'subscriber-users',
    component: SubscriberUsers,
  },
  {
    path: '/hr/users',
    name: 'hr-users',
    component: HRUsers,
  },
  {
    path: '/hr/status/users',
    name: 'hr-status-users',
    component: HrStatusUsers,
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
