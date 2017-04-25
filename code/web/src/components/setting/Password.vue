<template>
	<el-form :model="formData" :rules="fromRules" ref="formData" label-width="100px" class="demo-ruleForm">
		<el-form-item label="原始密码" prop="originPassword">
			<el-input type="password" v-model="formData.originPassword" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="新密码" prop="password">
			<el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="确认密码" prop="checkPassword">
			<el-input type="password" v-model="formData.checkPassword" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="handleSubmit" :loading="formLoading">提交</el-button>
			<el-button @click="handleReset">重置</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
				var validatePassword = (rule, value, callback) => {
					if(value === '') {
						callback(new Error('请输入密码'));
					} else {
						if(this.formData.checkPassword !== '') {
							this.$refs.formData.validateField('checkPassword');
						}
						callback();
					}
				};
				var validateCheck = (rule, value, callback) => {
					if(value === '') {
						callback(new Error('请再次输入新密码'));
					} else if(value !== this.formData.password) {
						callback(new Error('两次输入密码不一致!'));
					} else {
						callback();
					}
				};
				return {
					formLoading: false,
					formData: {
						originPassword: '',
						password: '',
						checkPassword: ''
					},
					fromRules: {
						originPassword: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
						password: [{ validator: validatePassword, trigger: 'blur' }],
						checkPassword: [{ validator: validateCheck, trigger: 'blur' }]
					}
				};
			},
			methods: {
				handleReset() {
					this.$refs.formData.resetFields();
				},
				handleSubmit(ev) {
					this.$refs.formData.validate((valid) => {
						if(!valid) {
							return false;
						}
						let uid = this.$store.state.user.uid;
						this.$http.patch('/api/user/password/' + uid, {
							oldPassword: md5(this.formData.originPassword),
							newPassword: md5(this.formData.password),
						}).then((response) => {
							if(response.nice) {
								this.$message({
						          message: '密码修改成功',
						          type: 'success'
						        });
							}
						});
					});
				}
			}
	}
</script>