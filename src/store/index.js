import {createStore} from 'vuex'
import createPersistedState from "vuex-persistedstate";
// import axios from 'axios'
// 公共状态
const store= createStore({
	// vuex的持久化管理
	plugins:[
	    createPersistedState()
	],
	state(){
		return{
			adminInfo:{
				account:'',
				nickname:'',
				usetime:'',
			},
		}
	},
	// mutations中不支持异步（例如axios）
	mutations:{
		setadminInfo(state,admininfo){
			console.log(admininfo+"aaaaaa")
			state.adminInfo.account=admininfo[0]
			state.adminInfo.nickname=admininfo[1]
			state.adminInfo.usetime=admininfo[2]
		},
	},
	// 支持异步和同步
	actions:{
	}
})
export default store