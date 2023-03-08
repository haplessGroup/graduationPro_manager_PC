import layout from "@/layout/index.vue";
import { ElMessage } from "element-plus";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const routers: RouteRecordRaw[] = [
  // 路由重定向，当访问的路径不存在或只输入域名时，重定向到Login
  {
    path: "/:pathMatch(.*)",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/Login/login.vue"),
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
        meta: { title: "角色管理" },
      },
      {
        path: "/treateadvice",
        component: () => import("@/views/treatadvice/treateadvice.vue"),
        meta: { title: "建议处理" },
      },
    ],
  },
  {
    path: "/account",
    name: "Account",
    component: layout,
    meta: { title: "账号信息处理" },
    children: [
      {
        path: "/useraccounthand",
        component: () =>
          import("@/views/userhandling/useraccounthand/useraccounthand.vue"),
        meta: { title: "账号处理" },
      },
      {
        path: "/userregiinfohand",
        component: () =>
          import("@/views/userhandling/userregiinfohand/userregiinfohand.vue"),
        meta: { title: "注册处理" },
      },
    ],
  },
  {
    path: "/message",
    name: "Message",
    component: layout,
    redirect: "noRedirect",
    meta: { title: "用户留言处理" },
    children: [
      {
        path: "doubantop",
        component: () =>
          import("@/views/treatdatamessage/doubantop/doubantop.vue"),
        meta: { title: "电影留言" },
      },
      {
        path: "prolanguage",
        component: () =>
          import("@/views/treatdatamessage/aboutit/prolanguage.vue"),
        meta: { title: "语言留言" },
      },
      {
        path: "hottravelcity",
        component: () =>
          import("@/views/treatdatamessage/hottravelcity/hottravelcity.vue"),
        meta: { title: "城市留言" },
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
router.beforeEach((to, from, next) => {
  if (auth.includes(to.fullPath)) {
    let token = localStorage.getItem("admintoken");
    if (token === null || token === "") {
      ElMessage({
        showClose: true,
        message: "请先登录！",
        type: "error",
      });
      // console.log("asasdasdadas")
      next({
        path: "/login",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
