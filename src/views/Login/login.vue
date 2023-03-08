<template>
	<el-container>
		<div class="background">
			<div class="main">
				<div class="tit">"零数据"分析平台管理系统</div>
				<div class="lo">欢迎登录</div>
				<el-divider id="di" style="width: 250px;margin: 10px auto;"></el-divider>
				<div class="center">
					<el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="60px"
						class="demo-ruleForm">
						<el-form-item label="用户名" prop="account">
							<el-input v-model="ruleForm.account" type="text" placeholder="请输入用户名" />
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input v-model.trim="ruleForm.password" type="password" placeholder="请输入密码" />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</el-container>
</template>

<script lang="ts" setup>
import router from '@/router';
import { LoginAdmin } from '@/services/api/user';
import type { AdminInfo } from '@/store';
import { useAdminInfoStore } from "@/store";
import { ElMessage, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

// import { io } from 'socket.io-client'

const admintoken = ref("")
const adminInfo = ref<AdminInfo>()
const adminInfoStore = useAdminInfoStore()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
	account: "",
	password: ""
})

const validatePass = (rule: any, value: any, callback: any) => {
	if (value === "") {
		callback(new Error("请输入密码"));
	} else if (value.length < 5) {
		callback(new Error("密码长度不小于5位"));
	} else if (value.length > 16) {
		callback(new Error("密码长度不大于20位"));
	} else {
		if (ruleForm.account !== "") {
			if (!ruleFormRef.value) return;
			ruleFormRef.value.validateField("checkPass", () => null);
		}
		callback();
	}
};
const validatePass2 = (rule: any, value: any, callback: any) => {
	if (value === "") {
		callback(new Error("请输入用户名"));
	} else {
		callback();
	}
};
const rules = reactive({
	password: [{ validator: validatePass, trigger: "blur" }],
	account: [{ validator: validatePass2, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			console.log(ruleForm);
			LoginAdmin({ ...ruleForm }).then(res => {
				ElMessage({
					message: '恭喜！登录成功！',
					type: 'success',
					showClose: true
				})
				admintoken.value = res.data.admintoken
				localStorage.setItem("admintoken", admintoken.value)
				adminInfo.value = {
					account: res.data.adminaccount,
					nickname: res.data.adminnickname,
					usetime: res.data.usetime
				}
				adminInfoStore.account = adminInfo.value.account
				setTimeout(() => {
					router.push({ name: 'Home' })
				}, 2000)
			})
		} else {
			console.log('error submit!')
			return false
		}
	})
}

// const adminLogin = () => {

// 	LoginAdmin({ "account": ruleForm.account, "password": adminpass.password }).then(res => {
// 		if (res.data == "account error") {
// 			ElMessage({
// 				message: '账号不存在或者输入错误~',
// 				type: 'error',
// 				showClose: true
// 			})
// 		} else if (res.data == "password error") {
// 			ElMessage({
// 				message: '密码错误~',
// 				type: 'error',
// 				showClose: true
// 			})
// 		} else if (res.data == "ERROR") {
// 			ElMessage({
// 				message: '系统出现错误~',
// 				type: 'error',
// 				showClose: true
// 			})
// 		} else {
// 			ElMessage({
// 				message: '恭喜！登录成功！',
// 				type: 'success',
// 				showClose: true
// 			})
// 			console.log(res.data)
// 			admintoken.value = res.data.admintoken
// 			// console.log(res)
// 			localStorage.setItem("admintoken", admintoken.value)
// 			adminInfo.value = {
// 				account: res.data.adminaccount,
// 				nickname: res.data.adminnickname,
// 				usetime: res.data.usetime
// 			}
// 			adminInfoStore.account = adminInfo.value.account
// 			setTimeout(() => {
// 				router.push("/home")
// 			}, 2000)
// 		}
// 	})

// }

</script>

<style lang="scss" scoped>
* {
	margin: 0;
	padding: 0;
}

.background {
	width: 100%;
	height: 100%;
	/**宽高100%是为了图片铺满屏幕 */
	z-index: -1;
	position: absolute;
	object-fit: cover;
	background-image: url('@/assets/adminbg.jpg');
	display: flex;
	justify-content: center;
	align-items: center;
}

.imgSrc {
	height: 100%;
	width: 100%;

}

.tit {
	text-align: center;
	margin-top: 10px;
	font-weight: bold;
	font-size: 25px;
	color: #333333;
}

.lo {
	font-size: 18px;
	font-weight: bold;
	text-align: center;
	margin-top: 50px;
	color: #333333;
}

.main {
	display: flex;
	align-items: center;
	flex-direction: column;

	width: 800px;
	height: 500px;
	margin: auto;
	background: rgba(255, 255, 255, .3);
	box-shadow: 4px 4px 6px 3px rgba(0, 0, 0, .3);
	border-radius: 15px;

	&::before {
		background: url("../../assets/adminbg.jpg");
		background-position: top;
		background-size: cover;
		background-attachment: fixed;
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		filter: blur(5px);
		z-index: -1;
	}

	.center {
		width: 300px;
		display: flex;

		margin-top: 30px;
		height: 200px;

	}

	.el-form-item {
		margin-bottom: 30px;
	}

	.el-button {
		width: 100%;
	}
}
</style>
