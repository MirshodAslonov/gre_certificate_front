// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import axios from '@/plugins/axios'

// Public pages
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Welcome from '../views/Welcome.vue';
import AdminHome from '../views/AdminHome.vue';

// MAIN ADMIN LAYOUT
import SchoolCrm from '../views/SchoolCrm.vue';

// CHILD PAGES
import UsersPage from '../views/UsersPage.vue';
import GroupsPage from '../views/GroupsPage.vue';
import GroupUsers from '../views/GroupUsers.vue';
import Lessons from '../views/Lessons.vue';
import StudentLesson from '../views/StudentLesson.vue';
import Dashboard from '../views/Dashboard.vue';
import UserPage from '../views/User.vue';
import TeachersPage from '../views/Teachers.vue';
import TeacherGroupAttendance from '../views/TeacherGroupAttendance.vue';
import Attendance from '../views/Attendance.vue';
import AdminAttendance from '../views/AdminAttendance.vue';
import ParentsPage from '../views/ParentsPage.vue';
import RegisterWithoutPassword from '../views/RegisterWithoutPassword.vue';
import UserDailyProblemStat from '../views/UserDailyProblemStat.vue';
import ParentsStatusList from '../views/ParentsStatusList.vue';
const routes = [
  { path: '/', name: 'welcome', component: Welcome },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/registerWithoutPassword', name: 'registerWithoutPassword', component: RegisterWithoutPassword },
  { path: '/home', name: 'home', component: Home },
  { path: '/admin_home', name: 'admin_home', component: AdminHome },
  { path: '/student_lesson', name: 'student_lesson', component: StudentLesson },
  { path: '/user/:id', name: 'user_page', component: UserPage , props: true },
  { path: '/teacher/group/attendance', name: 'teacher_group_attendance', component: TeacherGroupAttendance},
  { path: '/attendance', name: 'attendance_page', component: Attendance},
  { path: '/admin/attendance', name: 'adminattendancepage', component: AdminAttendance},
  { path: '/user/daily_problem_stat', name: 'user_daily_problem_stat', component: UserDailyProblemStat},
  // ⭐ ADMIN PANEL LAYOUT
  {
    path: '/schoolcrm',
    component: SchoolCrm,
    redirect: '/schoolcrm/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'users', name: 'userspage', component: UsersPage },
      { path: 'teachers', name: 'teacherspage', component: TeachersPage },
      { path: 'groups', name: 'groupspage', component: GroupsPage },
      { path: 'group_users/:id', name: 'groupusers', component: GroupUsers },
      { path: 'lessons', name: 'lessons', component: Lessons },
      { path: 'parents_page', name: 'parents_page', component: ParentsPage },
      { path: 'parents_status', name: 'parents_status', component: ParentsStatusList },
    ]
  },

  // 404 redirect
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ⭐ Public sahifalar
const publicPages = ['login', 'register', 'welcome' , 'registerWithoutPassword'];

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('api_token');

  // Public sahifalar
  if (publicPages.includes(to.name)) {

    // Token bo‘lsa login → home
    if (to.name === 'login' && token) {
      try {
        const res = await axios.get('/api/user/auth/get', {
          headers: { Authorization: `Bearer ${token}` }
        });
         const user = res.data;
         if (user.role_id == 1) return next({ name: 'admin_home' });
        else return next({ name: 'home' });
      } catch {
        return next();
      }
    }
    return next();
  }

  // Token yo‘q bo‘lsa → login
  if (!token) return next({ name: 'login' });

  try {
    const res = await axios.get('/api/user/auth/get', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = res.data;

    // Role ga qarab yo‘naltirish
    if (to.name === 'home' && user.role_id == 1) {
      return next({ name: 'admin_home' });
    }
    return next();
  } catch {
    return next({ name: 'login' });
  }
});

export default router;
