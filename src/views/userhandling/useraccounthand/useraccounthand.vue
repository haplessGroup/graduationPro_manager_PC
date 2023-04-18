<template>
		<!-- 表格 -->
		<vxe-grid v-bind="gridOptions" v-on="gridEvents">
			<template #account_item="{ data }">
				<vxe-input v-model="data.account" type="text" clearable placeholder="请输入账号"></vxe-input>
			</template>
			<template #status_item="{ data }">
				<vxe-select v-model="data.accstatus" transfer clearable>
					<vxe-option v-for="item in options1" :key="item.value" :value="item.value" :label="item.label">
					</vxe-option>
				</vxe-select>
			</template>
			<template #operate_item>
				<vxe-button type="submit" status="primary" content="查询" @click="findList()"></vxe-button>
				<vxe-button type="reset" content="重置" @click="showAllAccounts()"></vxe-button>
			</template>
			<template #pager>
				<vxe-pager :layouts="['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total']"
					v-model:current-page="tablePage.currentPage" v-model:page-size="tablePage.pageSize" :total="tablePage.total"
					@page-change="handlePageChange">
				</vxe-pager>
			</template>

			<template #operate="{ row }">
				<vxe-button type="text" status="primary" content="提交" @click="submitData(row)"></vxe-button>
				<vxe-button type="text" status="primary" content="删除" @click="deleteData(row)"></vxe-button>
			</template>
			<template #role_list_default="{ row }">

				<span>{{ formatRole(row.role_list) }}</span>
			</template>
			<template #role_list_edit="{ row }">
				<vxe-select v-model="row.role_list" transfer>
					<vxe-option v-for="item in options3" :key="item.value" :value="item.value" :label="item.name"></vxe-option>
				</vxe-select>
			</template>
			<template #accstatus_edit="{ row }">
				<vxe-select v-model="row.accstatus" transfer>
					<vxe-option v-for="item in options1" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
				</vxe-select>
			</template>

			<template #isloginallowed_edit="{ row }">
				<vxe-select v-model="row.isloginallowed" transfer>
					<vxe-option v-for="item in options2" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
				</vxe-select>
			</template>
		</vxe-grid>
		<vxe-modal v-model="dialog" title="添加用户账号" width="800" min-width="600" min-height="300" :esc-closable="true" resize
			destroy-on-close>
			<template #default>
				<vxe-form :data="userinfo" :rules="formRules2" title-align="right" title-width="100">
					<vxe-form-item title="账号信息" title-align="left" :title-width="200" :span="24"
						:title-prefix="{ icon: 'vxe-icon-comment' }"></vxe-form-item>
					<vxe-form-item field="account" title="用户账号" :span="12" :item-render="{}">
						<template #default="{ data }">
							<vxe-input v-model="data.account"></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item field="nickname" title="用户昵称" :span="12" :item-render="{}">
						<template #default="{ data }">
							<vxe-input v-model="data.nickname"></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item field="password" title="用户密码" :span="12" :item-render="{}">
						<template #default="{ data }">
							<vxe-input v-model="data.password"></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item field="userphone" title="用户手机" :span="12" :item-render="{}">
						<template #default="{ data }">
							<vxe-input v-model="data.userphone"></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item field="useridcard" title="用户身份证号" :span="12" :item-render="{}">
						<template #default="{ data }">
							<vxe-input v-model="data.useridcard"></vxe-input>
						</template>
					</vxe-form-item>
					<!-- <vxe-form-item field="user_id" title="用户id" :span="12" :item-render="{}">
										<template #default="{ data }">
											<vxe-input v-model="data.user_id"></vxe-input>
										</template>
									</vxe-form-item> -->

					<vxe-form-item align="center" title-align="left" :span="24">
						<template #default>
							<vxe-button type="submit" @click="onSubmit">提交</vxe-button>
						</template>
					</vxe-form-item>
				</vxe-form>
			</template>
		</vxe-modal>
</template>
<script lang="ts" setup>
import { getRole } from '@/services/api/role';
import { createAccount, deleteAccount, ForAllAccount, updateAccount } from '@/services/api/user';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { VxeFormPropTypes, VxeGridInstance, VxeGridListeners, VxeGridProps, VxePagerEvents, VXETable, VxeTableInstance } from 'vxe-table';
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
const formRules2 = ref({
	userphone: [
		{ required: true, message: '请输入名称' },
		{ min: 11, max: 11, message: '请输入正确手机号' }
	],
	password: [
		{ required: true, min: 3, message: '密码长度过短', }
	],
	sex: [
		{ required: true, message: '请选择性别' }
	],

}) as unknown as VxeFormPropTypes.Rules
const options3 = ref<Array<{ value: string, name: string }>>([
	{
		value: '0',
		name: "超级管理员"
	},
	{
		value: '1',
		name: "管理员"
	},
	{
		value: '2',
		name: "普通"
	}
])
const accstatu = ref('')
const tablePage = reactive({
	total: 0,
	currentPage: 1,
	pageSize: 10
})
getRole({ skip: 10, page: 1, }).then((res) => {
	console.log(res);
	options3.value = res.data.pagination.map((item) => {
		return { name: item.identity, value: item.role_id }
	})
})
const userinfo = reactive({
	account: "",
	nickname: "",
	password: "",
	userphone: "",
	useridcard: "",
})
const dialog = ref(false)
const xGrid = ref<VxeGridInstance>()
const formatRole = (value: any) => {
	const found = options3.value.find((item) => {
		return item.value == value
	})
	return found?.name

	// if (value === '0') {
	// 	return '超级管理员'
	// }
	// if (value === '1') {
	// 	return '管理员'
	// }
	// if (value === '2') {
	// 	return '普通用户'
	// }
	// return ''
}
const xTable = ref<VxeTableInstance>()
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
	keepSource: true,
	formConfig: {
		data: {
			account: undefined,
			accstatus: undefined
		},
		items: [
			{ field: 'account', title: '账号', slots: { default: 'account_item' } },
			{ field: 'accstatus', title: '状态', titlePrefix: { message: '帮助信息！！！', icon: 'vxe-icon-question-circle-fill' }, slots: { default: 'status_item' } },
			{ slots: { default: 'operate_item' } }
		]
	},
	toolbarConfig: {
		buttons: [
			{ code: 'myInsert', name: '新增' },

		],
		export: true,
		custom: true
	},
	columns: [
		{ type: 'seq', width: 60 },
		{ field: 'account', title: '用户账号', sortable: true },
		{ field: 'password', title: '用户密码' },
		{ field: 'nickname', title: '用户昵称' },

		{ field: 'userphone', title: '用户电话', sortable: true },
		{ field: 'role_list', title: '角色', editRender: {}, slots: { default: 'role_list_default', edit: 'role_list_edit' } },
		{ field: 'accstatus', title: '账号状态', sortable: true, editRender: { autofocus: '.vxe-input--inner' }, slots: { edit: 'accstatus_edit' } },
		{ field: 'isloginallowed', title: '是否允许登录', sortable: true, editRender: {}, slots: { edit: 'isloginallowed_edit' } },
		{ title: '操作', slots: { default: 'operate' } }
	],
	data: []
})

const findList = () => {
	gridOptions.loading = true
	ForAllAccount({ skip: tablePage.pageSize, page: tablePage.currentPage, ...gridOptions.formConfig?.data }).then(res => {
		gridOptions.data = res.data.pagination; gridOptions.loading = false; tablePage.total = res.data.accNum
	})
}
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
	tablePage.currentPage = currentPage
	tablePage.pageSize = pageSize
	findList()
}
const gridEvents: VxeGridListeners = {
	toolbarButtonClick({ code }) {
		const $grid = xGrid.value
		switch (code) {
			case 'myInsert': {
				dialog.value = true
				break
			}

		}
	},
}

const showAllAccounts = () => {
	gridOptions.loading = true
	ForAllAccount({ skip: 10, page: 1 }).then(res => {
		tablePage.currentPage = 1
		tablePage.pageSize = 10
		gridOptions.loading = false;
		gridOptions.data = res.data.pagination;
		tablePage.total = res.data.accNum
	})
}
const onSubmit = () => {
	var user = userinfo

	createAccount(user).then((res: any) => {
		console.log(res.msg === 'OK');
		// console.log(drawerloading)
		if (res.msg === 'OK') {
			ElMessage({
				message: '提交成功!',
				type: "success",
				showClose: true
			})
			findList()
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
findList()

const submitData = (data: { account: string; accstatus: any; isloginallowed: any, id: number, role_list: number }) => {
	account.value = data.account
	// console.log(data.accstatus)
	updateAccount({ account: data.account, accstatus: data.accstatus, isloginallowed: data.isloginallowed, user_id: data.id, role_list: data.role_list }).then((res: any) => {
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
}

const deleteData = async (data: { account: string; accstatus: any; isloginallowed: any, user_id: number }) => {

	const type = await VXETable.modal.confirm('您确定要删除该数据?')
	if (type === 'confirm') {
		deleteAccount({ account: data.account, user_id: data.user_id }).then((res: any) => {
			if (res.msg == "OK") {
				ElMessage({
					message: "删除成功!",
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

	}
	findList()
	account.value = data.account
	// console.log(data.accstatus)

}
</script>


<style>
.box-card {
	width: 100%;
	overflow-y: auto;
	margin-top: 10px;
}
</style>
