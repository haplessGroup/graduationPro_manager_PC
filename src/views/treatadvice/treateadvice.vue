<template>
	<el-container style="background-color: #F5F5F5;height: 100vh;">
		<el-aside style="width: 220px;">
			<div>
				<SideNaviBar></SideNaviBar>
			</div>
		</el-aside>
		<el-main>
			<!-- 位置显示 -->
			<div style="font-size: 10px;margin-top: -10px;">
				当前位置:用户建议处理
			</div>
			<!-- 用户建议数据展示 -->
			<div>
				<el-card class="box-card">
					<div class="mt-4">
						<!-- clearable：是否显示清除按钮
						 @clear：在点击清除之后触发的事件
						 -->
						<el-input
						  v-model="search"
						  placeholder="请输入账号在此搜索..."
						  class="input-with-select"
						  style="width: 300px;"
						  clearable
						  @clear="afterClear"
						>
							<template #append>
								<el-button @click="searchAdvice">
									<!-- 搜索图标 -->
									<img src="../../assets/search.png"  
										style="width: 20px;height: 20px;margin-top: -3px;">
								</el-button>
							</template>
						</el-input>
						<!-- 建议状态筛选 -->
						<span  style="margin-left: 20px;font-size: 16px;margin-right: 10px;color: #909399;font-weight: bold;">建议筛选:</span>
						<!-- 
							@change：在选中之后触发的事件
						 -->
						<el-select 
							v-model="advicestatu" 
							class="m-2" 
							placeholder="请选择建议状态" 
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
						<!-- 
							border	是否带有纵向边框
							empty-text：没有数据显示的文本内容
						 -->
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
							<el-table-column prop="nickname" label="用户昵称" />
							<el-table-column prop="qnumber" label="QQ" />
							<el-table-column prop="email" label="电子邮箱" />
							<el-table-column prop="category" label="建议类别" />
							<el-table-column prop="advice" label="用户建议" />
							<el-table-column prop="rate" label="评分" />
							<el-table-column prop="status" label="状态" />
							<el-table-column label="操作" >
								<!-- scope：限制作用域，只操作当前对象的属性 -->
								<template #default="scope">
									<div>
										<el-button type="text" size="small" @click="open(scope.row)">去处理</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<!-- 抽屉效果 -->
					<div style="text-align: center;">
						<el-drawer
							v-model="dialog"
							title="用户建议处理"
							direction="ltr"
							:before-close="handleClose"
							size="50%"
						  >
							<div style="margin: 0 auto;width: 400px;">
								<el-form :model="userinfo">
									<el-form-item label="用户账号:" style="margin-left: 50px;">
									  <el-input v-model="userinfo.acc" style="width: 150px;" disabled />
									</el-form-item>
									<el-form-item label="用户昵称:" style="margin-left: 50px;">
									  <el-input v-model="userinfo.nic" style="width: 150px;" disabled />
									</el-form-item>
									<el-form-item label="用户QQ:" style="margin-left: 50px;">
									  <el-input v-model="userinfo.qq" style="width: 150px;" disabled />
									</el-form-item>
									<el-form-item label="用户邮箱:" style="margin-left: 50px;">
									  <el-input v-model="userinfo.ema" style="width: 150px;" disabled />
									</el-form-item>
									<el-form-item label="建议类别:" style="margin-left: 50px;">
									  <el-input v-model="userinfo.cate" style="width: 150px;" disabled />
									</el-form-item>
									<el-form-item label="用户建议:" style="margin-left: 50px;">
									  <el-input v-model="userinfo.adv" style="width: 150px;" disabled />
									</el-form-item>
									<el-form-item label="用户评分:" style="margin-left: 50px;">
									  <el-input v-model="userinfo.rat" style="width: 150px;" disabled />
									</el-form-item>
									<el-form-item label="建议状态:" style="margin-left: 50px;">
									  <el-select v-model="userinfo.statu" placeholder="请选择" style="width: 150px;">
										<el-option label="待处理" value="待处理" />
										<el-option label="已处理" value="已处理" />
									  </el-select>
									</el-form-item>
									<el-form-item label="管理回复:" style="margin-left: 50px;">
									  <el-input 
										type="textarea" 
										v-model="userinfo.re" 
										style="width: 250px;"
										clearable
										maxlength="255"
										placeholder="请输入回复内容...(最多255个字)"
										show-word-limit
										:rows="8"/>
									</el-form-item>
									<el-form-item >
										<el-button style="margin: 0 auto;" type="primary" @click="onSubmit">提交</el-button>
									</el-form-item>
								</el-form>
							</div>
						</el-drawer>
					</div>
				</el-card>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import SideNaviBar from '@/components/sideNaviBar.vue'
	import { Search } from '@element-plus/icons-vue'
	import https from '@/utils/https.js'
	import axios from 'axios'
	import { ElMessage,ElMessageBox  } from 'element-plus'
	import { io } from 'socket.io-client'
	export default {
		components:{
			SideNaviBar
		},
		data() {
			return{
				search:'',
				tableData:[],
				loading:false,
				dialog:false,
				userinfo:{
					id:"",
					acc:"",
					nic:"",
					qq:"",
					ema:"",
					cate:"",
					adv:"",
					rat:"",
					statu:"",
					re:""
				},
				socket:null,
				// 调教筛选：建议处理状态
				advicestatu:'',
				options:[
				  {
				    value: '待处理',
				    label: '待处理',
				  },
				  {
				    value: '已处理',
				    label: '已处理',
				  }
				]
			}
		},
		mounted() {
			this.showUserAdvice()
			this.socket = io('ws://127.0.0.1:5000')
			this.socket.on('connect', () => console.log('connect: websocket 连接成功！'))
			this.socket.on(this.userinfo.acc)
		},
		methods:{
			showUserAdvice(){
				this.loading=true
				https.httpForAllAdvice().then(res=>{
					this.loading=false
					console.log(res.data)
					if(res.data=="no result")
					{
						ElMessage({
							message: '暂无建议~',
							type: 'warning',
							showClose:true
						})
					}else if(res.data=="ERROR")
					{
						ElMessage({
							message: '后台出现错误~',
							type: "error",
							showClose:true
						})
					}else{
						this.tableData=res.data
					}
				})
			},
			// 搜索建议
			searchAdvice(){
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
						url:"http://127.0.0.1:5000/serarchadvice",
						method:"POST",
						data:{"account":this.search}
					}).then(res=>{
						this.loading=false
						if(res.data=="no result")
						{
							ElMessage({
								message: '没有找到账号'+this.search+"的建议~",
								type: "warning",
								showClose:true
							})
						}else if(res.data=="ERROR")
						{
							ElMessage({
								message: '后台出现错误~',
								type: "error",
								showClose:true
							})
						}else{
							this.tableData=res.data
						}
					})
				}
			},
			// 清空之后重新请求数据
			afterClear(){
				this.showUserAdvice()
			},
			open(data){
				this.dialog=true
				console.log(data)
				this.userinfo.id=data.id
				this.userinfo.acc=data.account
				this.userinfo.nic=data.nickname
				this.userinfo.qq=data.qnumber
				this.userinfo.ema=data.email
				this.userinfo.cate=data.category
				this.userinfo.adv=data.advice
				this.userinfo.rat=data.rate
				this.userinfo.statu=data.status
				this.userinfo.re=data.re
				
			},
			onSubmit(){
				var user=this.userinfo
				if(user.re=='')
				{
					ElMessage({
						message: '请输入回复消息!',
						type: "error",
						showClose:true
					})
				}else if(user.statu=='待处理')
				{
					ElMessage({
						message: '请将状态改为已处理~',
						type: "warning",
						showClose:true
					})
				}else{
					axios({
						url:"http://127.0.0.1:5000/submitreresult",
						method:"POST",
						data:{"statu":user.statu,"re":user.re,"id":user.id,"account":user.acc}
					}).then(res=>{
						// console.log(this.drawerloading)
						if(res.data=='ok')
						{
							ElMessage({
								message: '提交成功!',
								type: "success",
								showClose:true
							})
							this.dialog=false
							setTimeout(location.reload(),1000)
						}else if(res.data=="failed")
						{
							ElMessage({
								message: '提交失败!',
								type: "error",
								showClose:true
							})
						}else{
							ElMessage({
								message: '系统出现错误!',
								type: "error",
								showClose:true
							})
						}
					})
				}
			},
			// 选中值发生变化时触发
			selectStatu(){
				if(this.advicestatu=="")
				{
					this.showUserAdvice()
				}else{
					this.loading=true
					// console.log(this.advicestatu)
					axios({
						url:"http://127.0.0.1:5000/selectadvicestatu",
						method:"POST",
						data:{"statu":this.advicestatu}
					}).then(res=>{
						this.loading=false
						if(res.data=="no result")
						{
							ElMessage({
								message: '暂未找到状态为'+this.advicestatu+'的建议~',
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
			// 在点击选择器的清除之后
			afterSelectClear(){
				this.showUserAdvice()
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
	.input-with-select .el-input-group__prepend {
	  background-color: var(--el-fill-color-blank);
	}
</style>
