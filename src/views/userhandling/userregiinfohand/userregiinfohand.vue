<template>
	<el-container style="background-color: #F5F5F5;height: 100vh;">
		<el-aside style="width: 220px;">
			<SideNaviBr></SideNaviBr>
		</el-aside>
		<el-container style="background-color: #F5F5F5;height: 695px;">
			<el-main style="font-size: 10px;margin-top: -10px;">
				<div>当前位置:用户信息处理>>用户注册信息处理</div>
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
								v-model="loginstatu" 
								class="m-2" 
								placeholder="请选择注册信息状态" 
								size="middle"
								clearable
								@clear="afterSelectClear"
								@change="selectStatu">
							    <el-option
							      v-for="item in options"
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
								<el-table-column prop="useridcard" label="身份证号" />
								<!-- <el-table-column prop="identity" label="身份证号" />
								<el-table-column prop="identity" label="身份证号" /> -->
								<el-table-column prop="regitime" label="注册时间" />
								<el-table-column label="是否通过" >
									<!-- scope:作用域 -->
									<template #default="scope">
										<div>
											<el-select v-model="scope.row.isloginallowed" class="m-2" placeholder="请选择" size="large">
											    <el-option label="是" value="是" />
											    <el-option label="否" value="否" />
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
	export default {
		components:{
			SideNaviBr
		},
		data() {
			return{
				search:'',
				tableData:[],
				loading:false,
				loginstatu:"",
				options:[
					{
						value:"是",
						label:"是"
					},
					{
						value:"否",
						label:"否"
					}
				]
			}
		},
		mounted() {
			this.showAllAccounts()
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
				// console.log(data.accstatus)
				axios({
					url:"http://127.0.0.1:5000/userregiinfohand",
					method:"POST",
					data:{"account":data.account,"isloginallowed":data.isloginallowed}
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
				if(this.loginstatu=="")
				{
					this.showAllAccounts()
				}else{
					this.loading=true
					// console.log(this.advicestatu)
					axios({
						url:"http://127.0.0.1:5000/selectloginstatu",
						method:"POST",
						data:{"statu":this.loginstatu}
					}).then(res=>{
						this.loading=false
						if(res.data=="no result")
						{
							ElMessage({
								message: '暂未搜索到结果哦~',
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
