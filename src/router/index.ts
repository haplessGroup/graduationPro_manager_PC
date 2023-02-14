import layout from '@/layout/index.vue'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const routers: RouteRecordRaw[] = [
  // 路由重定向，当访问的路径不存在或只输入域名时，重定向到Login
  {
    path: '/:pathMatch(.*)',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/views/Login/login.vue'),
  },
  {
    path: '/data',
    component: layout,
    redirect: 'noredirect',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/index.vue'),
      },
      {
        path: '/treateadvice',
        component: () => import('@/views/treatadvice/treateadvice.vue'),
      },
      {
        path: '/useraccounthand',
        component: () =>
          import('@/views/userhandling/useraccounthand/useraccounthand.vue'),
      },
      {
        path: '/userregiinfohand',
        component: () =>
          import('@/views/userhandling/userregiinfohand/userregiinfohand.vue'),
      },
      {
        path: '/doubantop',
        component: () =>
          import('@/views/treatdatamessage/doubantop/doubantop.vue'),
      },
      {
        path: '/prolanguage',
        component: () =>
          import('@/views/treatdatamessage/aboutit/prolanguage.vue'),
      },
      {
        path: '/hottravelcity',
        component: () =>
          import('@/views/treatdatamessage/hottravelcity/hottravelcity.vue'),
      },
    ],
  },
  {
    path: '/test',
    component: () => import('@/views/Test/test.vue'),
  },
]

const router = createRouter({
  routes: routers,
  history: createWebHistory(),
})

//全局拦截->beforeEach:每次路由切换前执行
const auth = [
  '/treateadvice',
  '/useraccounthand',
  '/userregiinfohand',
  '/doubantop',
  '/prolanguage',
  '/hottravelcity',
]
router.beforeEach((to, from, next) => {
  if (auth.includes(to.fullPath)) {
    let token = localStorage.getItem('admintoken')
    if (token === null || token === '') {
      ElMessage({
        showClose: true,
        message: '请先登录！',
        type: 'error',
      })
      // console.log("asasdasdadas")
      next({
        path: '/login',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
