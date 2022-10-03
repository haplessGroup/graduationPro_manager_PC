import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import home from '@/views/Home/index.vue'
import treateadvice from '@/views/treatadvice/treateadvice.vue'
import useraccounthand from '@/views/userhandling/useraccounthand/useraccounthand.vue'
import userregiinfohand from '@/views/userhandling/userregiinfohand/userregiinfohand.vue'
import login from "@/views/Login/login.vue"
import doubantop from '@/views/treatdatamessage/doubantop/doubantop.vue'
import prolanguage from '@/views/treatdatamessage/aboutit/prolanguage.vue'
import hottravelcity from '@/views/treatdatamessage/hottravelcity/hottravelcity.vue'
const routers=[
	// 路由重定向，当访问的路径不存在或只输入域名时，重定向到Login
	{
		path:'/:pathMatch(.*)',
		redirect:'/login',
	},
	{
		path:"/login",
		component:login
	},
	{
		path:'/home',
		component:home
	},
	{
		path:"/treateadvice",
		component:treateadvice
	},
	{
		path:"/useraccounthand",
		component:useraccounthand
	},
	{
		path:"/userregiinfohand",
		component:userregiinfohand
	},
	{
		path:'/doubantop',
		component:doubantop
	},
	{
		path:'/prolanguage',
		component:prolanguage
	},
	{
		path:'/hottravelcity',
		component:hottravelcity
	}
	
	
]

const router = createRouter({
  routes: routers,
  history: createWebHistory(),
});

//全局拦截->beforeEach:每次路由切换前执行
const auth=['/treateadvice','/useraccounthand','/userregiinfohand','/doubantop','/prolanguage','/hottravelcity']
router.beforeEach((to, from, next) => {
  if (auth.includes(to.fullPath)) {
	  let token=localStorage.getItem("admintoken")
   if(token===null || token==="")
   {
	   ElMessage({
	       showClose: true,
	       message: '请先登录！',
	       type: 'error',
	     })
	   // console.log("asasdasdadas")
	   next({
	   	path:'/login'
	   })
   }else{
	   next()
   }
  } else {
    next();
  }
});

export default router