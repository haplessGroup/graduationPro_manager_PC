<template>

	<div style="font-size: 10px;margin-top: -10px;">
		当前位置:用户留言处理>>编程语言使用情况
	</div>
	<div>
		<el-card style="height: 100%;overflow: hidden;" class="box-card">
			<!-- 表格 -->
			<vxe-grid v-bind="gridOptions" v-on="gridEvents">
				<template #account_item="{ data }">
					<vxe-input v-model="data.account" type="text" placeholder="请输入账号"></vxe-input>
				</template>
				<template #status_item="{ data }">
					<vxe-select v-model="data.status" transfer>
						<vxe-option v-for="item in options1" :key="item.value" :value="item.value" :label="item.label">
						</vxe-option>
					</vxe-select>
				</template>
				<template #operate_item>
					<vxe-button type="submit" status="primary" content="查询" @click="findList()"></vxe-button>
					<vxe-button type="reset" content="重置" @click="showAllAccounts()"></vxe-button>
				</template>
				<template #pager>
					<vxe-pager
						:layouts="['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total']"
						v-model:current-page="tablePage.currentPage" v-model:page-size="tablePage.pageSize"
						:total="tablePage.total" @page-change="handlePageChange">
					</vxe-pager>
				</template>
				<template #operate="{ row }">
					<vxe-button type="text" status="primary" content="删除" @click="deleteDate(row)"></vxe-button>
				</template>
				<template #latime_slot="{ row }">
					<span>{{ timeFormatSeconds(row.latime) }}</span>
				</template>
			</vxe-grid>
		</el-card>
	</div>

</template>
<script lang="ts" setup>
import { deleteLanguageMessage, ForProLanguageMessage } from '@/services/api/data';
import { timeFormatSeconds } from '@/utils/timeFormatSeconds';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { VxeGridListeners, VxeGridProps, VxePagerEvents } from 'vxe-table';
const search = ref('')
const tableData = ref([])
let loading = ref(false)
const account = ref('')
const options1 = ref([
	{
		value: "正常",
		label: "正常"
	},
	{
		value: "异常",
		label: "异常"
	},
	{
		value: "禁用",
		label: "禁用"
	}

])
const options2 = ref([
	{
		value: "是",
		label: "是"
	},
	{
		value: "否",
		label: "否"
	}
])
const accstatu = ref('')
const tablePage = reactive({
	total: 0,
	currentPage: 1,
	pageSize: 10
})
const gridOptions = reactive<VxeGridProps>({
	border: true,
	showOverflow: true,
	loading: false,
	height: 800,
	exportConfig: {},
	columnConfig: {
		resizable: true
	},
	editConfig: {
		trigger: 'click',
		mode: 'cell',
		showStatus: true
	},
	formConfig: {
		data: {
			account: '',
			status: ''
		},
		items: [
			{ field: 'account', title: '账号', slots: { default: 'account_item' } },
			{ field: 'status', title: '状态', titlePrefix: { message: '帮助信息！！！', icon: 'vxe-icon-question-circle-fill' }, slots: { default: 'status_item' } },
			{ slots: { default: 'operate_item' } }
		]
	},
	toolbarConfig: {
		export: true,
		custom: true
	},
	columns: [
		{ type: 'seq', width: 60 },
		{ field: 'laaccount', title: '用户账号', },
		{ field: 'lanickname', title: '用户昵称' },
		{ field: 'laidentity', title: '用户身份' },
		{ field: 'latime', title: '留言时间', slots: { default: 'latime_slot' } },
		{ field: 'lacontent', title: '留言内容', },
		{ title: '操作', slots: { default: 'operate' } }
	],
	data: []
})

const findList = () => {

	gridOptions.loading = true
	ForProLanguageMessage({ skip: tablePage.pageSize, page: tablePage.currentPage, ...gridOptions.formConfig?.data }).then(res => {

		gridOptions.data = res.data.pagination; gridOptions.loading = false; tablePage.total = res.data.plnum
	})

}
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
	tablePage.currentPage = currentPage
	tablePage.pageSize = pageSize
	findList()
}
const gridEvents: VxeGridListeners = {
	formSubmit() {
		findList()
	}
}
findList()



const deleteDate = (row: { laaccount: any; id: any; }) => {
	deleteLanguageMessage({ account: row.laaccount, id: row.id }).then((res: any) => {
		if (res.msg == "OK") {
			ElMessage({
				message: "提交成功!",
				type: 'success',
				showClose: true
			})
			findList()
		} else if (res.msg == "failed") {
			ElMessage({
				message: "提交失败~",
				type: 'error',
				showClose: true
			})
		} else {
			ElMessage({
				message: "后台出错了~",
				type: 'error',
				showClose: true
			})
		}
	})
	findList()
}
const showAllAccounts = () => {
	gridOptions.loading = true
	ForProLanguageMessage({ skip: 10, page: 1 }).then((res) => {
		tablePage.currentPage = 1
		tablePage.pageSize = 10
		gridOptions.data = res.data.pagination; gridOptions.loading = false; tablePage.total = res.data.plnum
	})
}

</script>

<style>

</style>
