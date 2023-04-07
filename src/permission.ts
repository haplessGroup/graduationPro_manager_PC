import useAppStore from "./store/app"
const store = useAppStore()
const {
  data: {
    roles: { menus }
  }
} = await store.dispatch('user/getInfo')
// 深层解构menus
// console.log(menus, asyncRoutes, 7555)
/* 1-根据获取的权限筛选出对应的路由匹配规则 */
var filterRouter = asyncRoutes.filter((item) => {
  // 筛选不需要的动态路径
  var name = item.children[0].name
  // 获取子路径名称
  var flag = menus.includes(name)
  // 判断权限中是否包含该路径名
  if (flag) {
    return item
  }
})

/* 2-动态添加路由匹配规则 */
router.addRoutes(filterRouter)
/* 3-将动态路由传入store中 */
store.commit('menu/serRoutes', filterRouter)
      }
