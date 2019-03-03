<template>
	<el-row class="main" type="flex" justify="center">
		<el-col :span="12" style="min-width: 300px; max-width: 400px;">
			<el-row class="form">
				<el-col>
					<label :class="{focus: focus.username}">
						<span>用户名</span>
						<el-input
							@focus="focus.username=true"
							@blur="focus.username=form.username==''?false:true"
							:placeholder="focus.username?placeholder.username:''"
							v-model="form.username"
							:disabled="loading"
							ref="username"
						></el-input>
					</label>
				</el-col>
				<el-col>
					<label :class="{focus: focus.password}">
						<span>密码</span>
						<el-input
							type="password"
							@focus="focus.password=true"
							@blur="focus.password=form.password==''?false:true"
							:placeholder="focus.password?placeholder.password:''"
							v-model="form.password"
							:disabled="loading"
							ref="password"
						></el-input>
					</label>
				</el-col>
				<el-col>
					<label :class="{focus: focus.passwordTwo}">
						<span>确认密码</span>
						<el-input
							type="password"
							@focus="focus.passwordTwo=true"
							@blur="focus.passwordTwo=form.passwordTwo==''?false:true"
							:placeholder="focus.passwordTwo?placeholder.passwordTwo:''"
							v-model="form.passwordTwo"
							:disabled="loading"
							ref="passwordTwo"
						></el-input>
					</label>
				</el-col>
				<el-col>
					<el-row type="flex" align="bottom">
						<el-col :span="12">
							<el-button type="primary" @click="reg" :loading="loading">注册</el-button>
						</el-col>
						<el-col :span="12" class="text-right">
							<router-link to="/login">登陆</router-link>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-col>
	</el-row>
</template>

<script>
export default {
	name: "reg",
	data() {
		return {
			focus: {
				username: false,
				password: false,
				passwordTwo: false
			},
			placeholder: {
				username: "手机号/邮箱",
				password: "格式:[A-Z]{1}(.*){7,}",
				passwordTwo: "再次输入一遍"
			},
			form: {
				username: "",
				password: "",
				passwordTwo: ""
			},
			loading: false
		};
	},
	methods: {
		reg() {
			if (this.form.username === "") return this.$refs.username.focus();
			if (this.form.password === "") return this.$refs.password.focus();
			if (this.form.passwordTwo === "")
				return this.$refs.passwordTwo.focus();
			this.loading = true;
			// this.console(this.form);
			let form = JSON.parse(JSON.stringify(this.form));
			if (form.password === form.passwordTwo) {
				form.password = this.$md5(form.password);
				delete form.passwordTwo;
				this.$http("users/insert", { data: form })
					.then(data => {
						this.$message.success(`${form.username} 用户注册成功!`);
						this.loading = false;
						this.$store.commit("account.UPDATE", data);
					})
					.catch(e => {
						switch (e.code) {
							case 11000:
								this.$message.error(
									`该用户已经存在,请尝试更换用户名!`
								);
								break;

							default:
								this.$message.error(
									`未知错误: ${JSON.stringify(e)}`
								);
								break;
						}
						this.loading = false;
					});
			}
		}
	},
	mounted() {}
};
</script>

<style scoped>
div.el-row.form > div.el-col {
	margin-bottom: 20px;
}

label {
	user-select: none;
	position: relative;
	display: block;
}

label > span {
	font-size: 14px;
	position: absolute;
	z-index: 1;
	top: 10px;
	left: 15px;
	color: #999;
	background: none;
	padding: 0;
}

label.focus > span {
	font-size: 12px;
	position: absolute;
	z-index: 1;
	top: -8px;
	left: 7px;
	color: #333;
	background: #fff;
	padding: 0 10px;
}

button.el-button {
	margin-right: 20px;
}
</style>
