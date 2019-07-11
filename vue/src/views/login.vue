<template>
    <el-row class="main" type="flex" justify="center">
        <el-col :span="12" style="min-width: 300px; max-width: 400px;">
            <el-row class="form">
                <el-col>
                    <label :class="{focus: focus.username}">
                        <span>用户名</span>
                        <el-input
                                :autofocus="true"
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
                                show-password
                                @focus="focus.password=true"
                                @blur="focus.password=form.password==''?false:true"
                                :placeholder="focus.password?placeholder.password:''"
                                v-model="form.password"
                                :disabled="loading"
                                ref="password"
                                @keyup.enter.native="login"
                        ></el-input>
                    </label>
                </el-col>
                <el-col>
                    <el-row type="flex" align="bottom">
                        <el-col :span="12">
                            <el-button type="primary" @click="login" :loading="loading">登陆</el-button>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <router-link to="/reg">注册一个账号</router-link>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
	export default {
		name: "login",
		title: "登陆帐号",
		data() {
			return {
				focus: {
					username: false,
					password: false
				},
				placeholder: {
					username: "手机号/邮箱",
					password: "格式:[A-Z]{1}(.*){7,}"
				},
				form: {
					username: "",
					password: ""
				},
				loading: false
			};
		},
		methods: {
			login() {
				if (this.form.username === "") return this.$refs.username.focus();
				if (this.form.password === "") return this.$refs.password.focus();
				this.loading = true;
				// this.console(this.form);
				let form = JSON.parse(JSON.stringify(this.form));
				form.password = this.$md5(form.password);
				this.$http("users/once", { where: form })
					.then(data => {
						if (data) {
							this.$message.success(`${form.username} 用户登陆成功!`);
							this.$store.commit("account.UPDATE", data);
							this.$router.push({
								path: this.$route.query.redirect || "/home"
							});
						} else {
							this.$message.error(
								`${form.username} 用户登陆失败,请稍后再试!`
							);
						}
						this.loading = false;
					})
					.catch(e => {
						this.$message.error(`未知错误: ${JSON.stringify(e)}`);
						this.loading = false;
					});
			}
		},
		mounted() {
		}
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
