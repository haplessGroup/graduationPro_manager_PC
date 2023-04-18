<template>
	<!-- 标题 -->
	<div id="header" style="font-size: 30px;font-weight: bold;text-align: center;color: #708090;">
		欢迎来到"零数据"分析平台管理系统
		</div>
						<!-- 分割线 -->
						<el-divider></el-divider>
						<!-- 四个板块 -->
						<div id="acc" style="display: flex;">
							<!-- 注册总人数 -->
							<div class="block1">
								目前平台共注册:{{ accountstatus.allacc }}人
							</div>
							<div class="block2">
								正常状态:{{ accountstatus.normal }}人
							</div>
							<div style="background-color: #DCE10D;" class="block2">
								警告状态:{{ accountstatus.warning }}人
							</div>
							<div style="background-color: #B90F0F;" class="block2">
								禁用状态:{{ accountstatus.prohibition }}人
							</div>
						</div>
						<!-- 用户注册量 -->
						<div id="hi" style="text-align: center;" class="mt-20px">
							<div class="data">
								<h2 class="tit">一周用户注册量</h2>
								<el-divider></el-divider>
								<!-- 为 ECharts 准备一个定义了宽高的 DOM -->
								<div id="main1" style="width: 100%;height:300px;margin:30px auto 30px auto;"></div>
							</div>
							<!-- 处理账号量 -->
							<div class="data" style="margin-left: 100px;">
								<h2 class="tit">各用户角色信息分布</h2>
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
									<span style="font-weight: bold;font-family: '微软雅黑';font-size: 20px;color: #6495ED;">用户建议预览</span>
									<el-button class="button" type="text" @click="gotoTreatAdvice">去处理</el-button>
								</div>
							</template>
							<vxe-grid v-bind="gridOptions"></vxe-grid>
						</el-card>
					</div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { ForAccountStatus, ForAllAdvice } from '@/services/api/user';
import * as echarts from "echarts";
import { VxeGridProps } from 'vxe-table';

import { getRoleCount, getweekData } from '@/services/api/chart';
import { nextTick, reactive, ref } from 'vue';
export interface paramsQuer {
	skip: number,
	page: number
}
const allaccount = ref(0)
const allAdvice = ref<Array<any>>([])
const loading = ref(false)
const accountstatus = reactive({
	normal: "",
	warning: "",
	prohibition: "",
	allacc: "",
})
const query = reactive<paramsQuer>({
	skip: 10,
	page: 1
})
const gridOptions = reactive<VxeGridProps>({
	border: true,
	height: 400,
	columnConfig: {
		resizable: true
	},
	columns: [

		{ type: 'seq', width: 60 },
		{ field: 'account', title: '用户账号' },
		{ field: 'nickname', title: '用户昵称' },
		{ field: 'category', title: '留言类别' },
		{ field: 'status', title: '处理状态', showOverflow: true }
	],
	proxyConfig: {
		ajax: {
			// 接收 Promise
			query: () => {
				return ForAllAdvice(query).then(res => res.data.pagination)
			}
		}
	}
})
const showAccountStatus = () => {
	ForAccountStatus().then(res => {
		accountstatus.normal = res.data["normal"]
		accountstatus.warning = res.data["warning"]
		accountstatus.prohibition = res.data["prohibition"]
		accountstatus.allacc = res.data["allacc"]
	})
}
// 一周用户注册量

let dateTime = reactive<Array<string>>([])
const dateCount = ref()
const showHistogram = () => {
	let chartDom = document.getElementById('main1') as HTMLElement;
	let myChart = echarts.init(chartDom);
	let option;

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
				data: dateTime,
				axisTick: {
					alignWithLabel: true
				},
				axisLabel: {
					interval: 0,
					rotate: 40
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
				data: dateCount.value
			}
		]
	};
	option && myChart.setOption(option);
}
const getData = async () => {
	const { data: oneData } = await getweekData()
	dateTime = Object.keys(oneData[0])
	dateCount.value = Object.values(oneData[0]).map((item) => { return item.length })
	const { data } = await getRoleCount()
	RoleCountInfo.value = data.pagination.map((item) => {
		return { value: item.value, name: item.label }
	})
	nextTick(() => {
		showHistogram()
		showHandlingAccount()

	})

}
getData()

const showHandlingAccount = () => {
	let chartDom = document.getElementById('main2') as HTMLElement;
	let myChart = echarts.init(chartDom);
	let option;

	option = {
		tooltip: {
			trigger: 'item'
		},
		legend: {
			top: '5%',
			left: 'center'
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2
				},
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 20,
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				data: RoleCountInfo.value
			}
		]
	};

	option && myChart.setOption(option);
}
const RoleCountInfo = ref<Array<{ value: number, name: string }>>()


// 从后台获取所有建议
// const showAllAdvice = () => {
// 	let loading = true
// 	ForAllAdvice(query).then(res => {
// 		// console.log(res.data)
// 		if (res.data == "no result") {
// 			loading = false
// 			ElMessage({
// 				message: '暂无留言~',
// 				type: 'warning',
// 			})
// 		} else if (res.data == "ERROR") {
// 			loading = false
// 			ElMessage.error('后台出现错误!')
// 		} else {
// 			loading = false
// 			allAdvice.value = res.data.pagination
// 		}
// 	})
// }
const gotoTreatAdvice = () => {
	router.push("/treateadvice")
}

// showAllAdvice(),
showAccountStatus()
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

body {
	background-color: #F5F5F5;
}

.block1 {
	width: 150px;
	height: 100px;
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

.block2 {
	margin-left: 10px;
	height: 100px;
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

.tit {
	text-align: center;
	padding-top: 10px;
	font-family: "Berlin Sans FB";
	color: #333333;
}

.data {
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

.over {
	overflow-y: auto;
	overflow-x: hidden;
}

.box-card {
	width: 100%;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
	width: 12px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
	background-color: white;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, 0.1);
	-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
</style>
