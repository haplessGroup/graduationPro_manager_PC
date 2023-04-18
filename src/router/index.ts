import layout from "@/layout/index.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// router/index.ts
import { useAdminInfoStore } from "@/store";
import { hasPermission } from "@/utils/hasPermission";
import { close, start } from "@/utils/nporgress";
import { until } from "@vueuse/core";
const routers: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/Login/login.vue"),
    meta: { whiteList: true }
  },
  {
    redirect: '/home',
    path: '/'
  },
  {
    path: "/data",
    component: layout,
    redirect: "noredirect",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Home/index.vue"),
        meta: { title: "首页" },
      },
      {
        path: "/role",
        name: "Role",
        component: () => import("@/views/Role/role.vue"),
        meta: { title: "角色管理", id: 2 },
      },
      {
        path: "/treateadvice",
        component: () => import("@/views/treatadvice/treateadvice.vue"),
        meta: { title: "建议处理", id: 3 },
      }
    ],
  },
  {
    path: "/account",
    name: "Account",
    component: layout,
    meta: { title: "账号信息处理", id: 4 },
    children: [
      {
        path: "/useraccounthand",
        component: () =>
          import("@/views/userhandling/useraccounthand/useraccounthand.vue"),
        meta: { title: "账号处理", id: 5 },
      },
      {
        path: "/userregiinfohand",
        component: () =>
          import("@/views/userhandling/userregiinfohand/userregiinfohand.vue"),
        meta: { title: "注册处理", id: 6 },
      },
    ],
  },
  {
    path: "/message",
    name: "Message",
    component: layout,
    redirect: "noRedirect",
    meta: { title: "用户留言处理", id: 7 },
    children: [
      {
        path: "doubantop",
        component: () =>
          import("@/views/treatdatamessage/doubantop/doubantop.vue"),
        meta: { title: "电影留言", id: 8 },
      },
      {
        path: "prolanguage",
        component: () =>
          import("@/views/treatdatamessage/aboutit/prolanguage.vue"),
        meta: { title: "语言留言", id: 9 },
      },
      {
        path: "hottravelcity",
        component: () =>
          import("@/views/treatdatamessage/hottravelcity/hottravelcity.vue"),
        meta: { title: "城市留言", id: 10 },
      },
    ],
  },
  {
    path: "/test",
    component: () => import("@/views/Test/test.vue"),
  },
];



const router = createRouter({
  routes: routers,
  history: createWebHistory(),
});

//全局拦截->beforeEach:每次路由切换前执行
const auth = [
  "/treateadvice",
  "/useraccounthand",
  "/userregiinfohand",
  "/doubantop",
  "/prolanguage",
  "/hottravelcity",
];

router.beforeEach(async (to, from, next) => {
  // getRouteList()
  const adminInfoStore = useAdminInfoStore()
  if (to.meta.whiteList != true) {
    await until(adminInfoStore.route_list).toMatch(Boolean)
  }
  if (hasPermission(to.meta.id as number)) {
    next()
  } else {
    adminInfoStore.account = ""
    adminInfoStore.nickname = ""
    adminInfoStore.usetime = ""
    adminInfoStore.route_list = []
    router.replace('/login')
  }
  start();
});

router.afterEach(() => {
  close();
});

export default router;
