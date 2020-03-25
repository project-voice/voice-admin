import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/Home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  // 视频管理
  {
    path: '/video',
    component: Layout,
    children: [{
      path: 'video',
      name: 'Video',
      component: () => import('@/views/Video/index'),
      meta: { title: '视频管理', icon: 'banner' }
    }]
  },
  // 话题管理
  {
    path: '/topic',
    component: Layout,
    children: [{
      path: 'topic',
      name: 'Topic',
      component: () => import('@/views/Topic/index'),
      meta: { title: '话题管理', icon: 'feedback' }
    }]
  },
  // 流利说管理
  {
    path: '/speak',
    component: Layout,
    redirect: '/speak/speak-stage',
    meta: { title: '流利说管理', icon: 'advisory' },
    children: [{
      path: 'speak-stage',
      name: 'SpeakStage',
      component: () => import('@/views/Speak/stage'),
      meta: { title: '学习阶段管理', icon: 'advisory' }
    },
    {
      path: 'speak-question',
      name: 'speakQuestion',
      component: () => import('@/views/Speak/question'),
      meta: { title: '学习题目管理', icon: 'advisory' }
    }]
  },
  // 反馈管理
  {
    path: '/feedback',
    component: Layout,
    children: [{
      path: 'feedback',
      name: 'Feedback',
      component: () => import('@/views/Feedback/index'),
      meta: { title: '反馈管理', icon: 'feedback' }
    }]
  },
  // 用户管理
  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'user',
      name: 'User',
      component: () => import('@/views/User/index'),
      meta: { title: '用户管理', icon: 'user' }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
