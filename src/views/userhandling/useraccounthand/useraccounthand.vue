<template>
	<el-container style="background-color: #F5F5F5;height: 100vh;">
		<el-aside style="width: 220px;">
			<SideNaviBr></SideNaviBr>
		</el-aside>
		<el-container style="height: 695px;">
			<el-main style="font-size: 10px;margin-top: -10px;">
				<div>当前位置:用户信息处理>>用户账号处理</div>
				<!-- 用户建议数据展示 -->
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
									<el-button @click="searchAccount">
										<!-- 搜索图标 -->
										<img src="../../../assets/search.png"  
											style="width: 20px;height: 20px;margin-top: -3px;">
									</el-button>
								</template>
					        </el-input>
							<!-- 账号状态筛选 -->
							<span  style="margin-left: 20px;font-size: 16px;margin-right: 10px;color: #909399;font-weight: bold;">账号筛选:</span>
							<el-select 
								v-model="accstatu" 
								class="m-2" 
								placeholder="请选择账号状态" 
								size="middle"
								clearable
								@clear="afterSelectClear"
								@change="selectStatu">
							    <el-option
							      v-for="item in options3"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value"
							    />
							</el-select>
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
							    <el-table-column prop="account" label="用户账号" width="150" />
							    <el-table-column prop="password" label="用户密码" />
								<el-table-column prop="nickname" label="用户昵称" />
								<el-table-column prop="userphone" label="用户电话" />
								<el-table-column prop="identity" label="用户身份" />
								<el-table-column prop="accstatus" label="账号状态" >
									<!-- scope:作用域 -->
									<template #default="scope">
										<div>
											<el-select v-model="scope.row.accstatus" class="m-2" placeholder="正常" size="large">
											    <el-option
											      v-for="item in options1"
											      :key="item.value"
											      :label="item.label"
											      :value="item.value"
											    />
											</el-select>
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="isloginallowed" label="是否允许登录">
									<template #default="scope">
										<div>
											<el-select v-model="scope.row.isloginallowed" class="m-2" placeholder="是" size="large">
												<el-option
												  v-for="item in options2"
												  :key="item.value"
												  :label="item.label"
												  :value="item.value"
												/>
											</el-select>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="操作">
									<template #default="scope">
										<div>
											<el-button type="text" size="small" @click="submitData(scope.row)">提交</el-button>
										</div>
								    </template>
								</el-table-column>
							</el-table>
						</div>
					</el-card>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import SideNaviBr from '@/components/sideNaviBar.vue'
	import https from '@/utils/https.js'
	import { ElMessage } from 'element-plus'
	import axios from 'axios'
	import { io } from 'socket.io-client'
	export default {
		components:{
			SideNaviBr
		},
		data() {
			return{
				search:'',
				tableData:[],
				loading:false,
				account:'',
				options1:[
					{
						value:"正常",
						label:"正常"
					},
					{
						value:"异常",
						label:"异常"
					},
					{
						value:"禁用",
						label:"禁用"
					}
					
				],
				options2:[
					{
						value:"是",
						label:"是"
					},
					{
						value:"否",
						label:"否"
					}
				],
				accstatu:'',
				options3:[
					{
						value:"正常",
						label:"正常"
					},
					{
						value:"异常",
						label:"异常"
					},
					{
						value:"禁用",
						label:"禁用"
					}
				]
			}
		},
		mounted() {
			this.showAllAccounts()
			this.socket = io('ws://127.0.0.1:5000')
			this.socket.on('connect', () => console.log('connect: websocket 连接成功！'))
			this.socket.on(this.account)
		},
		methods:{
			showAllAccounts(){
				this.loading=true
				https.httpForAllAccount().then(res=>{
					this.loading=false
					console.log(res)
					if(res.data=="no result")
					{
						ElMessage({
							message: '暂无账号~',
							type: 'warning',
							showClose:true
						})
					}else if(res.data=="ERROR")
					{
						ElMessage({
							message: '后台出错~',
							type: 'error',
							showClose:true
						})
					}else{
						this.tableData=res.data
					}
				})
			},
			// 点击搜索按钮
			searchAccount(){
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
						url:"http://127.0.0.1:5000/searchaccinfo",
						method:"POST",
						data:{"account":this.search}
					}).then(res=>{
						this.loading=false
						if(res.data=="no result")
						{
							ElMessage({
								message: '未找到账号为'+this.search+"的用户~",
								type: 'warning',
								showClose:true
							})
						}else if(res.data=="ERROR")
						{
							ElMessage({
								message: "后台出错了~",
								type: 'error',
								showClose:true
							})
						}else{
							this.tableData=res.data
						}
					})
				}
			},
			// 点击清空
			afterClear(){
				this.showAllAccounts()
			},
			submitData(data){
				this.account=data.account
				// console.log(data.accstatus)
				axios({
					url:"http://127.0.0.1:5000/useraccounthand",
					method:"POST",
					data:{"account":data.account,"accstatu":data.accstatus,"isloginallowed":data.isloginallowed}
				}).then(res=>{
					if(res.data=="ok")
					{
						ElMessage({
							message: "提交成功!",
							type: 'success',
							showClose:true
						})
						setTimeout(location.reload(),1000)
					}else if(res.data=="failed")
					{
						ElMessage({
							message: "提交失败~",
							type: 'error',
							showClose:true
						})
					}else{
						ElMessage({
							message: "后台出错了~",
							type: 'error',
							showClose:true
						})
					}
				})
			},
			selectStatu(){
				if(this.accstatu=="")
				{
					this.showAllAccounts()
				}else{
					this.loading=true
					// console.log(this.advicestatu)
					axios({
						url:"http://127.0.0.1:5000/selectaccstatu",
						method:"POST",
						data:{"statu":this.accstatu}
					}).then(res=>{
						this.loading=false
						if(res.data=="no result")
						{
							ElMessage({
								message: '暂未找到状态为'+this.accstatu+'的账号~',
								type: "success",
								showClose:true
							})
						}else if(res.data=="ERROR")
						{
							ElMessage({
								message: '后台出错了~',
								type: "error",
								showClose:true
							})
						}else{
							this.tableData=res.data
						}
					})
				}
			},
			afterSelectClear(){
				this.showAllAccounts()
			}
		}
	}
</script>

<style>
	.box-card {
	  width: 100%;
	  overflow-y: auto;
	  margin-top: 10px;
	}
</style>
