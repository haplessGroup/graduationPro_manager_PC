<template>
	<el-col :span="12">
		<el-menu :router="true" active-text-color="#ffd04b" background-color="#545c64" text-color="#FFFFF0"
			style="height: 100%;width: 220px;position: fixed;" :default-openeds="['3', '5']">
			<el-menu-item index="1">
				<span style="margin: 0 auto;color: #FFD700;font-weight: bold;">管理员:{{ 12}}</span>
			</el-menu-item>
			<el-menu-item index="/home">
				<span>首页</span>
			</el-menu-item>
			<el-sub-menu index="3">
				<template #title>
					<span>用户留言处理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/doubantop">豆瓣电影排行</el-menu-item>
					<el-menu-item index="/hottravelcity">热门旅游城市推荐</el-menu-item>
					<el-menu-item index="/prolanguage">编程语言使用情况</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-menu-item index="/treateadvice">
				<span>用户建议处理</span>
			</el-menu-item>
			<el-sub-menu index="5">
				<template #title>
					<span>用户信息处理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/useraccounthand">用户账号处理</el-menu-item>
					<el-menu-item index="/userregiinfohand">用户注册信息处理</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-menu-item index="6" @click="removeAdminTokenAndAdmininfo">
				<span>注销登录</span>
			</el-menu-item>
		</el-menu>
	</el-col>
</template>

<script lang="ts" setup >

import { ElMessage, ElMessageBox } from 'element-plus';


const removeAdminTokenAndAdmininfo = () => {
	ElMessageBox.confirm(
		'确定注销登录吗?',
		'注销登录',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
			ElMessage({
				type: 'success',
				message: '注销成功!',
			})
			localStorage.removeItem("admintoken")
			setTimeout(() => {
				location.reload()
			}, 1000)
		})
	// localStorage.removeItem("adminginfo")
	// console.log("注销按钮被点击了")
	// console.log(this.adminInfo.nickname)
}

</script>

<style>

</style>
