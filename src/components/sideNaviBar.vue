<template>
		<el-menu style="height: 100vh;" router :collapse="isCollapse" mode="vertical" class="el-menu-vertical-demo"
			:default-openeds="['3', '5']"
			:background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
			:text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor">
			<el-menu-item index="1">
				<span style="margin: 0 auto;color: #FFD700;font-weight: bold;">管理员:{{ 12 }}</span>
			</el-menu-item>
			<el-menu-item index="/home">
				<el-icon>
					<House />
				</el-icon>
				<span>首页</span>
			</el-menu-item>
			<el-menu-item index="/role">
				<el-icon>
					<User />
				</el-icon>
				<span>角色管理</span>
			</el-menu-item>
			<el-sub-menu index="3">
				<template #title>
					<el-icon>
						<ChatDotRound />
					</el-icon>
					<span>用户留言处理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/message/doubantop"><el-icon>
							<Film />
						</el-icon>豆瓣电影排行</el-menu-item>
					<el-menu-item index="/message/hottravelcity"><el-icon>
							<OfficeBuilding />
						</el-icon>热门旅游城市推荐</el-menu-item>
					<el-menu-item index="/message/prolanguage">
						<el-icon>
							<ChromeFilled />
						</el-icon>
						编程语言使用情况</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-menu-item index="/treateadvice">
				<el-icon>
					<ChatLineRound />
				</el-icon>
				<span>用户建议处理</span>
			</el-menu-item>
			<el-sub-menu index="5">
				<template #title>
					<el-icon>
						<ChatDotSquare />
					</el-icon>
					<span>用户信息处理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/useraccounthand">
						<el-icon>
							<FolderOpened />
						</el-icon>用户账号处理</el-menu-item>
					<el-menu-item index="/userregiinfohand">
						<el-icon>
							<DocumentCopy />
						</el-icon>用户注册信息处理</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-menu-item index="6" @click="removeAdminTokenAndAdmininfo">
				<span>注销登录</span>
			</el-menu-item>
		</el-menu>
</template>

<script lang="ts" setup >

import variables from '@/assets/style/variables.module.scss';
import useAppStore from '@/store/app';
import { ChatDotRound, ChatDotSquare, ChatLineRound, ChromeFilled, DocumentCopy, Film, FolderOpened, House, OfficeBuilding, User } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed } from 'vue';

const sideTheme = "theme-dark"
const appStore = useAppStore()
const isCollapse = computed(() => !appStore.sidebar.opened)
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
	min-height: 400px;
}
</style>
