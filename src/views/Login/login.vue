<template>
	<el-container >
		<el-main style="padding: 0;">
			<!-- 背景图片 -->
			<div class="background">
				<img :src="loginBg" class="imgSrc">
			</div>
			<div class="main">
				<div class="tit">"零数据"分析平台管理系统</div>
				<div class="lo">欢迎登录</div>
				<el-divider id="di" style="width: 250px;margin: 10px auto;"></el-divider>
				<div style="margin-top: 30px;">
					<div style="text-align: center;">
						<span style="font-weight: bold;color: #333333;">账号:</span>
						<el-input 
							v-model="adminaccount" 
							placeholder="请输入管理员账号" 
							clearable
							style="width: 200px;margin-left: 10px;"/>
					</div>
					<div style="text-align: center;margin-top: 20px;">
						<span style="font-weight: bold;color: #333333;">密码:</span>
						<el-input 
							v-model="adminpass" 
							placeholder="请输入管理员密码" 
							show-password
							type="password"
							clearable
							style="width: 200px;margin-left: 10px;"
							@keyup.enter="adminLogin"/>
					</div>
					<el-divider id="di" style="width: 250px;margin: 30px auto;"></el-divider>
					<!-- 登录按钮 -->
					<div style="width: 250px;margin: 20px auto;">
						<el-button type="primary" style="width: 250px;" @click="adminLogin()">登录</el-button>
					</div>
				</div>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import axios from 'axios'
	import { ElMessage } from 'element-plus'
	import {mapMutations} from 'vuex'
	// import { io } from 'socket.io-client'
	export default {
		data(){
			return{
				loginBg:require('@/assets/adminbg.jpg'),
				adminaccount:"",
				adminpass:"",
				admintoken:"",
				adminInfo:[],
				// socket:null
			}
		},
		// 进入页面时首先调用的钩子函数
		mounted() {
			// this.socket = io('ws://39.107.27.157:5310')
			
			// this.socket.on('connect', () => console.log('connect: websocket 连接成功！'))
			// this.socket.emit('message', "hahah")
		},
		// 离开时调用的钩子函数
		// beforeUnmount() {
		// 	// 关闭连接
		// 	this.socket.close()
			 
		// 	// 销毁 websocket 实例对象
		// 	this.socket = null
		// },
		methods:{
			...mapMutations(["setadminInfo"]),
			adminLogin(){
				if(this.adminaccount=="")
				{
					ElMessage({
						message: '账号不能为空!',
						type: 'error',
						showClose:true
					})
				}else if(this.adminpass=="")
				{
					ElMessage({
						message: '密码不能为空!',
						type: 'error',
						showClose:true
					})
				}else{
					axios({
						url:"http://127.0.0.1:5000/adminlogin",
						method:"POST",
						data:{"account":this.adminaccount,"password":this.adminpass}
					}).then(res=>{
						if(res.data=="account error")
						{
							ElMessage({
								message: '账号不存在或者输入错误~',
								type: 'error',
								showClose:true
							})
						}else if(res.data=="password error")
						{
							ElMessage({
								message: '密码错误~',
								type: 'error',
								showClose:true
							})
						}else if(res.data=="ERROR")
						{
							ElMessage({
								message: '系统出现错误~',
								type: 'error',
								showClose:true
							})
						}else{
							ElMessage({
								message: '恭喜！登录成功！',
								type: 'success',
								showClose:true
							})
							console.log(res.data)
							this.admintoken=res.data.admintoken
							// console.log(res)
							localStorage.setItem("admintoken",this.admintoken)
							this.adminInfo=[
								res.data.adminaccount,
								res.data.adminnickname,
								res.data.usetime
							]
							this.setadminInfo(this.adminInfo)
							setTimeout(()=>{
								this.$router.push("/home")
							},2000)
						}
					})
				}
			}
		}
	}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
	}
	.background {
	    width: 100%;
	    height: 99%;
	    /**宽高100%是为了图片铺满屏幕 */
	    z-index: -1;
	    position: absolute;
		object-fit: cover;
	}
	 
	.imgSrc{
		height: 100%;
		width: 100%;
	}
	.tit{
		text-align: center;
		margin-top: 10px;
		font-weight: bold;
		font-size: 25px;
		color: #333333;
	}
	.lo{
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		margin-top: 50px;
		color: #333333;
	}
	.main{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 800px;
		height: 500px;
		margin: auto;
		background: rgba(255, 255, 255, .3);
		box-shadow: 4px 4px 6px 3px rgba(0, 0, 0, .3);
		border-radius: 15px;
	}
	
	.main::before {
	    background: url("../../assets/adminbg.jpg");
	    background-position: top;
	    background-size: cover;
	    background-attachment: fixed;
	    content: '';
	    position: absolute;
	    top: 0;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    filter: blur(5px);
		z-index: -1;
	}
</style>
