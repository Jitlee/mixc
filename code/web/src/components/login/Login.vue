<template>
	<el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
		<h3 class="title">系统登录</h3>
		<el-form-item prop="username">
			<el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click.native.prevent="handleSubmit" :loading="formLoading" class="el-button-block">登录</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import { mapActions } from 'vuex'
	import md5 from 'js-md5'
	
	export default {
		data() {
			return {
				formLoading: false,
				loginForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				},
				checked: true
			};
		},
		methods: {
			...mapActions([ 'setPassport', 'setNavTarget']),
			handleSubmit(ev) {
				this.$refs.loginForm.validate((valid) => {
					if(!valid) {
						return;
					}
					this.formLoading = true;
					this.$http.post('/api/passport/login', { 
						username: this.loginForm.username,
						password: md5(this.loginForm.password),
					}).then((response) => {
						if(response.nice) {
							this.setPassport(response.data.rst);
							var navTarget = this.$store.state.nav.target;
							if(navTarget != '') {
								this.setNavTarget('');
								this.$router.replace(navTarget);
							} else {
								this.$router.replace('/scene/floor');
							}
						}
					})
				});
			}
		}
	}
</script>

<style scoped>
	.card-box {
		padding: 20px;
		/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		margin-bottom: 20px;
		background-color: #F9FAFC;
		margin: 120px auto;
		width: 400px;
		border: 2px solid #8492A6;
	}
	
	.title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #505458;
	}
	
	.loginform {
		width: 350px;
		padding: 35px 35px 15px 35px;
	}
</style>