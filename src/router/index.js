import { createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import Layout from '@/layout'
import { KeepAlive } from 'vue'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: 'Home' }
      },
      {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
      },
      {
        path: '/403',
        component: () => import('@/views/error-page/403'),
        hidden: true
      },
      {
        path: '/500',
        component: () => import('@/views/error-page/500'),
        hidden: true
      },
      {
        path: 'login',
        name: "Login",
        component: () => import('@/views/Login/Login.vue'),
        meta: { title: 'Login' },
        hidden: true
      },
      {
        path: 'signup',
        name: "Sign Up",
        component: () => import('@/views/Login/SignUp.vue'),
        meta: { title: 'Sign Up' },
        hidden: true
      },
      {
        path: 'update_info',
        name: "Update Profile",
        component: () => import('@/views/Login/UpdateProfile.vue'),
        meta: { title: 'Update Profile' },
        hidden: true
      },
      {
        path: 'forget_password',
        name: "Forget Password",
        component: () => import('@/views/Login/ForgetPasswd.vue'),
        meta: { title: 'Forget Password' },
        hidden: true
      }
    ]
  }, 
  {
    path: '/m',
    component: Layout,
    meta: {
      title: 'Analysis',
    },
    children: [
      {
        path: 'Molecular',
        name: "Molecular",
        component: () => import('@/views/Analysis/Molecular.vue'),
        meta: { title: 'Molecular' },
      },
      {
        path: 'Reanalysis',
        name: "Reanalysis",
        component: () => import('@/views/Analysis/Reanalysis.vue'),
        meta: { title: 'Reanalysis' },
      },
      {
        path: 'Spectrum',
        name: "Spectrum",
        component: () => import('@/views/Analysis/Spectrum.vue'),
        meta: { title: 'Spectrum' },
      },
      {
        path: 'Customed',
        name: "Customed",
        component: () => import('@/views/Analysis/Customed.vue'),
        meta: { title: 'Customed' },
      },
    ]
  },
  {
    path: '/i',
    component: Layout,
    children: [
      {
        path: 'installation',
        component: () => import('@/views/Installation/Index.vue'),
        meta: { title: 'Installation'},
      }
    ]
  },
  {
    path: '/a',
    component: Layout,
    children: [
      {
        path: 'about',
        component: () => import('@/views/Installation/About.vue'),
        meta: { title: 'About'},
      },
    ]
  },
  {
    path: '/r',
    component: Layout,
    children: [
      {
        path: 'results',
        name: "Results",
        component: () => import('@/views/Results/Tasks.vue'),
        meta: { title: 'Results', keepAlive: true },
      },
      {
        path: 'task_detail',
        name: "TaskDetail",
        component: () => import('@/views/Results/TaskDetail.vue'),
        meta: { title: 'Task Detail', activeMenu: "/r/results" },
        hidden: true
      },
    ]
  },
  {
    path: '/languages',
    component: Layout,
    name: 'Language',
    alwaysShow: true, // will always show the root menu
    hidden: true,
    meta: {
      title: 'Language'
    },
    children: [
      {
        path: '/chinese',
        name: 'Chinese',
        meta: { title: 'Chinese' },
        hidden: true
      },
      {
        path: '/english',
        name: 'English',
        meta: { title: 'English' },
        hidden: true
      }
    ]
  }

]

export const asyncRoutes = []

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  },
  routes: constantRoutes
})

export default router
