<template>
	<el-container style="background-color: #F5F5F5;height: 100vh;">
		<el-aside style="width: 220px;">
			<div>
				<SideNaviBar></SideNaviBar>
			</div>
		</el-aside>
		<el-main>
			<!-- 标题 -->
			<div id="header" style="font-size: 30px;font-weight: bold;text-align: center;color: #708090;">
				欢迎来到"零数据"分析平台管理系统
			</div>
			<div id="posi" style="font-size: 10px;">
				当前位置:首页
			</div>
			<!-- 分割线 -->
			<el-divider></el-divider>
			<!-- 四个板块 -->
			<div id="acc" style="display: flex;">
				<!-- 注册总人数 -->
				<div class="block1">
					目前平台共注册:{{accountstatus.allacc}}人
				</div>
				<div class="block2">
					正常状态:{{accountstatus.normal}}人
				</div>
				<div style="background-color: #DCE10D;" class="block2">
					警告状态:{{accountstatus.warning}}人
				</div>
				<div style="background-color: #B90F0F;" class="block2">
					禁用状态:{{accountstatus.prohibition}}人
				</div>
			</div>
			<!-- 用户注册量 -->
			<div id="hi" style="text-align: center;margin-top: 20px;">
				<div class="data">
					<h2 class="tit">一周用户注册量</h2>
					<el-divider></el-divider>
					 <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
					<div id="main1" style="width: 100%;height:300px;margin:30px auto 30px auto;"></div>
				</div>
				<!-- 处理账号量 -->
				<div class="data" style="margin-left: 100px;">
					<h2 class="tit">每日处理账号量</h2>
					<el-divider></el-divider>
					 <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
					<div id="main2" style="width: 100%;height:300px;margin:30px auto 30px auto;"></div>
				</div>
			</div>
			<!-- 用户留言一览 -->
			<div style="margin-top: 20px;height: 300px;" class="over" v-loading="loading">
				<el-card class="box-card">
					<template #header>
					  <div class="card-header">
						<span style="font-weight: bold;font-family: '微软雅黑';font-size: 20px;color: #6495ED;">用户建议一览</span>
						<el-button class="button" type="text" @click="gotoTreatAdvice">去处理</el-button>
					  </div>
					</template>
					<div v-for="(item,index) in allAdvice" :key="index">
						<div style="font-weight: bold;font-size: 18px;">
							{{item.advice}}
						</div>
						<div style="display: flex;flex-direction: row;text-align: center;margin-top:30px;">
							<span style="flex:1;">用户账号:{{item.account}}</span>
							<span style="flex:1;">用户昵称:{{item.nickname}}</span>
							<span style="flex:1;">留言类别:{{item.category}}</span>
							<span style="flex:1;">处理状态:{{item.status}}</span>
						</div>
						<el-divider></el-divider>
					</div>
				</el-card>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import SideNaviBar from '@/components/sideNaviBar.vue'
	import * as echarts from '@/assets/js/echarts.min.js';
	import https from '@/utils/https.js'
	import { ElMessage } from 'element-plus'
export default {
	name: "App",
	components: {
		SideNaviBar
	},
	data(){
		return {
			allaccount:0,
			allAdvice:[],
			loading:false,
			accountstatus:{
				normal:"",
				warning:"",
				prohibition:"",
				allacc:"",
			}
		}
	},
	mounted() {
		this.showHistogram()
		this.showHandlingAccount()
		this.showAllAdvice(),
		this.showAccountStatus()
	},
	methods:{
		showAccountStatus(){
			https.httpForAccountStatus().then(res=>{
				// console.log(res)
				this.accountstatus.normal=res.data[0]["normal"]
				this.accountstatus.warning=res.data[0]["warning"]
				this.accountstatus.prohibition=res.data[0]["prohibition"]
				this.accountstatus.allacc=res.data[0]["allacc"]
				// console.log(this.accountstatus.normal)
			})
		},
		// 一周用户注册量
		showHistogram(){
			var chartDom = document.getElementById('main1');
			var myChart = echarts.init(chartDom);
			var option;
			
			option = {
			  tooltip: {
			    trigger: 'axis',
			    axisPointer: {
			      type: 'shadow'
			    }
			  },
			  grid: {
			    left: '3%',
			    right: '4%',
			    bottom: '3%',
			    containLabel: true
			  },
			  xAxis: [
			    {
			      type: 'category',
			      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			      axisTick: {
			        alignWithLabel: true
			      }
			    }
			  ],
			  yAxis: [
			    {
			      type: 'value'
			    }
			  ],
			  series: [
			    {
			      name: '数量',
			      type: 'bar',
			      barWidth: '60%',
			      data: [30, 10, 20, 35, 23, 42, 19]
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		showHandlingAccount(){
			var chartDom = document.getElementById('main2');
			var myChart = echarts.init(chartDom);
			var option;
			
			option = {
			  xAxis: {
			    type: 'category',
			    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			  },
			  yAxis: {
			    type: 'value'
			  },
			  series: [
			    {
			      data: [2, 5, 1, 8, 3, 4,5],
			      type: 'line'
			    }
			  ]
			};
			
			option && myChart.setOption(option);
		},
		// 从后台获取所有建议
		showAllAdvice(){
			this.loading=true
			https.httpForAllAdvice().then(res=>{
				// console.log(res.data)
				if(res.data=="no result"){
					this.loading=false
					ElMessage({
						message: '暂无留言~',
						type: 'warning',
					})
				}else if(res.data=="ERROR")
				{
					this.loading=false
					ElMessage.error('后台出现错误!')
				}else{
					this.loading=false
					this.allAdvice=res.data
				}
			})
		},
		gotoTreatAdvice(){
			this.$router.push("/treateadvice")
		}
	}
}
</script>

<style scoped>
	/* 屏幕小于1440px */
	@media screen and (max-width: 1440px) {
		.add {
			width: 260px;
		}
	}
	
	/* 屏幕等于1440px */
	@media screen and (max-width: 1440px) and (min-width: 1440px) {
		.add {
			width: 348px;
		}
	}
	
	/* 屏幕大于1440px */
	@media screen and (min-width:1441px) {
		.add {
			width: 348px;
		}
	}
	body{
		background-color: #F5F5F5;
	}
	.block1{
		width: 150px;
		height:100px;
		background-color: #9AB8FF;
		overflow-wrap: break-word;
		overflow-y: auto;
		display: inline-block;
		flex: 1;
		text-align: center;
		line-height: 100px;
		font-weight: bold;
		font-size: 20px;
		color: #333333;
	}
	.block2{
		margin-left: 10px;
		height:100px;
		background-color: #6DE6C5;
		overflow-wrap: break-word;
		overflow-y: auto;
		display: inline-block;
		flex: 1;
		text-align: center;
		line-height: 100px;
		font-weight: bold;
		font-size: 20px;
		color: #333333;
	}
	.tit{
	    text-align: center;
	    padding-top: 10px;
	    font-family: "Berlin Sans FB";
		color: #333333;
	}
	.data{
	    width: 500px;
	    height: auto;
		background-color: white;
		display: inline-block;
	}
	.card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}
	.over{
		overflow-y: auto;
		overflow-x: hidden;
	}
	.box-card {
	  width: 100%;
	}
	
	/* 设置滚动条的样式 */
	::-webkit-scrollbar {
	width:12px;
	}
	/* 滚动槽 */
	::-webkit-scrollbar-track {
	-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
	background-color: white;
	}
	/* 滚动条滑块 */
	::-webkit-scrollbar-thumb {
	background:rgba(0,0,0,0.1);
	-webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
	}
</style>
