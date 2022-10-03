<template>
	<el-container style="background-color: #F5F5F5;height: 100vh;">
		<el-aside style="width: 220px;">
			<SideNaviBar></SideNaviBar>
		</el-aside>
		<el-main>
			<div style="font-size: 10px;margin-top: -10px;">
				当前位置:用户留言处理>>编程语言使用情况
			</div>
			<div>
				<el-card class="box-card">
					<div class="mt-4">
						<el-input
						  v-model="search"
						  placeholder="请输入账号在此搜索..."
						  class="input-with-select"
						  style="width: 300px;"
						  clearable
						  @clear="afterClear"
						>
							<template #append>
								<el-button @click="searchMessage">
									<!-- 搜索图标 -->
									<img src="../../../assets/search.png"  
										style="width: 20px;height: 20px;margin-top: -3px;">
								</el-button>
							</template>
						</el-input>
					  </div>
					  <!-- 表格 -->
					<div style="margin-top: 10px;">
						<el-table
							v-loading="loading"
							:data="tableData" 
							border 
							style="width: 100%;" 
							height="550" 
							stripe
							empty-text="暂无数据">
							<el-table-column type="index" label="序号" width="80" />
							<el-table-column prop="laaccount" label="用户账号" width="150" />
							<el-table-column prop="lanickname" label="用户昵称" />
							<el-table-column prop="latime" label="留言时间" />
							<el-table-column prop="lacontent" label="留言内容" />
							<el-table-column label="操作" >
								<template #default="scope">
									<div>
										<el-button type="text" size="small" @click="deleteMessage(scope.row)">删除</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-card>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import SideNaviBar from '@/components/sideNaviBar.vue'
	import https from '@/utils/https.js'
	import axios from 'axios'
	import { ElMessage } from 'element-plus'
	import { io } from 'socket.io-client'
	export default {
		components:{
			SideNaviBar,
		},
		data(){
			return{
				search:'',
				loading:false,
				tableData:[],
				account:''
			}
		},
		mounted() {
			this.showProLanguageMessage()
			this.socket = io('ws://127.0.0.1:5000')
			this.socket.on('connect', () => console.log('connect: websocket 连接成功！'))
			this.socket.on(this.account)
		},
		methods:{
			showProLanguageMessage(){
				this.loading=true
				https.httpForProLanguageMessage().then(res=>{
					this.loading=false
					// console.log(res.data)
					if(res.data=='no result')
					{
						ElMessage({
							message: "暂无留言~",
							type: 'warning',
							showClose:true
						})
					}else if(res.data=="ERROR"){
						ElMessage({
							message: "系统错误~",
							type: 'error',
							showClose:true
						})
					}else{
						this.tableData=res.data
					}
				})
			},
			searchMessage(){
				if(this.search=='')
				{
					ElMessage({
						message: '搜索的账号不能为空!',
						type: 'error',
						showClose:true
					})
				}else{
					this.loading=true
					axios({
						url:"http://127.0.0.1:5000/searchprolanguagemessage",
						method:"POST",
						data:{"account":this.search}
					}).then(res=>{
						this.loading=false
						if(res.data=="no result")
						{
							ElMessage({
								message: '未找到账号为'+this.search+"的留言~",
								type: 'warning',
								showClose:true
							})
						}else if(res.data=="ERROR")
						{
							ElMessage({
								message: '系统出错了!',
								type: 'error',
								showClose:true
							})
						}else{
							this.tableData=res.data
						}
					})
				}
			},
			afterClear(){
				this.showProLanguageMessage()
			},
			deleteMessage(row)
			{
				this.account=row.laaccount
				// console.log(data.account)
				axios({
					url:"http://127.0.0.1:5000/languagemesstodel",
					method:"POST",
					data:{"id":row.id,"account":row.laaccount}
				}).then(res=>{
					if(res.data=='ok')
					{
						ElMessage({
							message: '删除成功~',
							type: 'success',
							showClose:true
						})
						setTimeout(()=>{
							location.reload()
						},2000)
					}else if(res.data=="failed")
					{
						ElMessage({
							message: '删除失败~',
							type: 'error',
							showClose:true
						})
					}else{
						ElMessage({
							message: '后台出现错误~',
							type: 'error',
							showClose:true
						})
					}
				})
			}
		}
	}
</script>

<style>
</style>
