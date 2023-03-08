<template>
		<vxe-grid v-bind="gridOptions" v-on="gridEvents">
			<template #account_item="{ data }">
				<vxe-input v-model="data.account" type="text" placeholder="请输入账号"></vxe-input>
			</template>
			<template #status_item="{ data }">
				<vxe-select v-model="data.status" transfer>
					<vxe-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
					</vxe-option>
				</vxe-select>
			</template>
			<template #operate_item>
				<vxe-button type="submit" status="primary" content="查询" @click="searchUser()"></vxe-button>
				<vxe-button type="reset" content="重置" @click="findList()"></vxe-button>
			</template>
			<template #pager>
				<vxe-pager :layouts="['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total']"
					v-model:current-page="tablePage.currentPage" v-model:page-size="tablePage.pageSize" :total="tablePage.total"
					@page-change="handlePageChange">
				</vxe-pager>
			</template>
			<template #operate="{ row }">
				<vxe-button type="text" status="primary" content="去处理" @click="open(row)"></vxe-button>
			</template>
		</vxe-grid>
		<!-- 抽屉效果 -->
		<div style="text-align: center;">
			<el-drawer v-model="dialog" title="用户建议处理" direction="ltr" size="50%">
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
							<el-input type="textarea" v-model="userinfo.re" style="width: 250px;" clearable maxlength="255"
								placeholder="请输入回复内容...(最多255个字)" show-word-limit :rows="8" />
						</el-form-item>
						<el-form-item>
							<el-button style="margin: 0 auto;" type="primary" @click="onSubmit">提交</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-drawer>
		</div>
</template>
<script lang="ts" setup>
import { ForAccount, ForAllAdvice, updatedAdvice } from '@/services/api/user';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { VxeGridListeners, VxeGridProps, VxePagerEvents } from 'vxe-table';
const search = ref('')
const tableData = ref([])
const loading = ref(false)
const dialog = ref(false)
const userinfo = reactive({
	id: "",
	acc: "",
	nic: "",
	qq: "",
	ema: "",
	cate: "",
	adv: "",
	rat: "",
	statu: "",
	re: ""
})
const searchUser = async () => {
	const result = await ForAccount({ key: gridOptions.formConfig?.data.account, skip: tablePage.pageSize, page: tablePage.currentPage, flag: 1 })
	gridOptions.data = result.data.pagination
	gridOptions.loading = false; tablePage.total = result.data.jynum

}
const socket = ref(null)
// 调教筛选：建议处理状态

const options = reactive([
	{
		value: '0',
		label: '待处理',
	},
	{
		value: '1',
		label: '已处理',
	}
])

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
		{ field: 'account', title: '用户账号' },
		{ field: 'nickname', title: '用户昵称' },
		{ field: 'qnumber', title: 'QQ' },
		{ field: 'email', title: '电子邮箱' },
		{ field: 'category', title: '建议类别' },
		{ field: 'advice', title: '用户建议' },
		{ field: 'rate', title: '评分' },
		{ field: 'status', title: '状态' },
		{ title: '操作', slots: { default: 'operate' } }
	],
	data: []
})

const findList = () => {
	gridOptions.loading = true
	ForAllAdvice({ skip: tablePage.pageSize, page: tablePage.currentPage }).then(res => {
		gridOptions.data = res.data.pagination; gridOptions.loading = false; tablePage.total = res.data.jynum
	})

}
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
	tablePage.currentPage = currentPage
	tablePage.pageSize = pageSize
	findList()
}
const gridEvents: VxeGridListeners = {
	formSubmit() {
		searchUser()
	}
}

findList()

const sexList1 = ref<any[]>([])

// 异步更新下拉选项
setTimeout(() => {
	sexList1.value = [
		{ value: '1', label: '男' },
		{ value: '0', label: '女' }
	]
}, 200)


// 搜索建议
const searchAdvice = () => {
	if (search.value == '') {
		ElMessage({
			message: '搜索的账号不能为空!',
			type: 'error',
			showClose: true
		})
	} else {
		loading.value = true
		axios({
			url: "http://127.0.0.1:5310/serarchadvice",
			method: "POST",
			data: { "account": search }
		}).then(res => {
			loading.value = false
			if (res.data == "no result") {
				ElMessage({
					message: '没有找到账号' + search + "的建议~",
					type: "warning",
					showClose: true
				})
			} else if (res.data == "ERROR") {
				ElMessage({
					message: '后台出现错误~',
					type: "error",
					showClose: true
				})
			} else {
				tableData.value = res.data
			}
		})
	}
}

const open = (data: { id: string; account: string; nickname: string; qnumber: string; email: string; category: string; advice: string; rate: string; status: string; re: string; }) => {
	dialog.value = true

	userinfo.id = data.id
	userinfo.acc = data.account
	userinfo.nic = data.nickname
	userinfo.qq = data.qnumber
	userinfo.ema = data.email
	userinfo.cate = data.category
	userinfo.adv = data.advice
	userinfo.rat = data.rate
	userinfo.statu = data.status
	userinfo.re = data.re

}
const onSubmit = () => {
	var user = userinfo
	if (user.re == '') {
		ElMessage({
			message: '请输入回复消息!',
			type: "error",
			showClose: true
		})
	} else if (user.statu == '待处理') {
		ElMessage({
			message: '请将状态改为已处理~',
			type: "warning",
			showClose: true
		})
	} else {
		updatedAdvice({ statu: user.statu, re: user.re, id: user.id, account: user.acc }).then((res: any
		) => {
			console.log(res.msg === 'OK');

			// console.log(drawerloading)
			if (res.msg === 'OK') {
				ElMessage({
					message: '提交成功!',
					type: "success",
					showClose: true
				})
				dialog.value = false
			} else if (res.msg == "failed") {
				ElMessage({
					message: '提交失败!',
					type: "error",
					showClose: true
				})
			} else {
				ElMessage({
					message: '系统出现错误!',
					type: "error",
					showClose: true
				})
			}
		})
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
