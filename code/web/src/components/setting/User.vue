<template>
  <div>
    <el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button @click.native="handleAdd">新增用户</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column type="index" label="序号" width="70" align="center" class="table-index-cell"></el-table-column>
			<el-table-column inline-template label="用户名">
				<div>{{ row.username }}</div>
			</el-table-column>
			<el-table-column inline-template label="昵称">
				<div>{{ row.displayName }}</div>
			</el-table-column>
			<el-table-column inline-template label="手机">
				<div>{{ row.phone }}</div>
			</el-table-column>
			<el-table-column inline-template label="状态"  width="80px">
				<i class="el-icon-circle-check" style="font-size: 18px; cursor: pointer" :style="{ color: row.isEnabled ? '#00b642' : '#999' }" @click="handleEnabled($index, row)"></i>
    		</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="150px">
				<div>
					<el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)" :disabled="row.uid == uid">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="15" layout="total, prev, pager, next" :total="totalCount">
		</el-pagination>
		
		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="80px" :rules="formRules" ref="formData">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="formData.username" auto-complete="off" :maxlength="20" :disabled='formData.uid > 0' placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="displayName">
					<el-input v-model="formData.displayName" auto-complete="off" :maxlength="20" placeholder="请输入昵称"></el-input>
				</el-form-item>
				<el-form-item label="真实名称">
					<el-input v-model="formData.trueName" auto-complete="off" :maxlength="20" placeholder="请输入真实姓名"></el-input>
				</el-form-item>
				<el-form-item label="手机">
					<el-input v-model="formData.phone" type="phone" auto-complete="off" :maxlength="20" placeholder="请输入手机"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="formData.tel" type="tel" auto-complete="off" :maxlength="30" placeholder="请输入电话"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="formData.email" type="email" auto-complete="off" :maxlength="20" placeholder="请输入手机"></el-input>
				</el-form-item>
				<el-form-item label="性别" align="left">
					<el-radio-group v-model="formData.sex">
			      <el-radio label="M">男</el-radio>
			      <el-radio label="F">女</el-radio>
			    </el-radio-group>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="formData.remark" placeholder="请输入备注(最多400字)" :maxlength="400"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="formSubmit" :loading="formLoading">保存</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
export default {
	data() {
		let clientId = this.$store.state.client.clientId
		let uid = this.$store.state.user.uid
		return {
			list: [],
			loading: true,
				
			currentPage: 1,
			totalCount: 0,
			clientId: clientId,
			uid: uid,
			
			formTitle: "",
			formLoading: false,
			formVisible: false,
			formData: {
				uid: 0,
				clientId: clientId,
				username: '',
				displayName: '',
				trueName: '',
				phone: '',
				tel: '',
				email: '',
				sex: 'M',
				remark: ''
			},
			formRules: {
				username: [
					{ required: true, message: '请输入登录名', trigger: 'blur' }
				],
				displayName: [
					{ required: true, message: '请输入昵称', trigger: 'blur' }
				]
			}
		};
	},
	created() {
		let defaultBuildId = this.$store.state.client.defaultBuildId;
		let routeBuildId = Number(this.$route.params.buildId); 
		if(defaultBuildId > 0) {
			this.buildId = defaultBuildId;
		} else if(routeBuildId > 0) {
			this.buildId = routeBuildId;
		}
		this.page(1);
	},
	methods: {
		page(pageNo) {
			this.$http.get(["/api/user/lst", this.clientId, pageNo].join("/")).then((response) => {
				if(response.data && response.data.code == 200) {
					let rst = response.data.rst
					if(rst) {
						this.list = rst.list;
						this.totalCount = rst.total;
					}
				}
				
				this.loading = false;
				this.currentPage = pageNo;
			}, (response) => {
				this.loading = false;
			});
		},
		
		handleCurrentChange(pageNo) {
			this.page(pageNo);
		},
		
		handleAdd() {
			this.formTitle = "新增用户"
			this.formData.uid = 0
			this.formData.clientId = this.clientId
			this.formData.username = ''
			this.formData.displayName = ''
			this.formData.trueName = ''
			this.formData.phone = ''
			this.formData.tel = ''
			this.formData.email = ''
			this.formData.sex = 'M'
			this.formData.remark = ''
			this.formVisible = true
		},
		handleEdit(index, row) {
			this.formData.formTitle = "编辑用户"
			this.formData.uid = row.uid
			this.formData.clientId = row.clientId
			this.formData.username = row.username
			this.formData.displayName = row.displayName
			this.formData.trueName = row.trueName
			this.formData.phone = row.phone
			this.formData.tel = row.tel
			this.formData.email = row.email
			this.formData.sex = row.sex
			this.formData.remark = row.remark
			this.formVisible = true
		},
		handleDelete(index, row) {
			this.$confirm('确认删除该用户吗?', '提示', {
				confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
			}).then(() => {
				this.$http.delete(["/api/user/delete", row.uid].join("/")).then((response) => {
					if(response.nice) {
						if(this.list.length == 1) {
							this.page(Math.max(1, this.currentPage - 1));
						} else {
							this.page(this.currentPage);
						}
					}
				});
			});
		},
		
		formSubmit() {
			this.$refs.formData.validate((valid)=>{
				if(!valid){
					return;
				}
				this.formLoading = true;
				this.$http.post('/api/user/save', this.formData).then((response) => {
					if(response.nice) {
						this.page(this.currentPage);
					}
				});
			});
		},
		
		handleEnabled(index, row) {
			if(row.uid == this.uid) {
				return
			}
			
			this.loading = true
			let url = ["/api/user/enable", row.uid, row.isEnabled ? 0 : 1].join("/")
			this.$http.patch(url).then((response) => {
				if(response.nice) {
					row.isEnabled = !row.isEnabled
				}
			});
		}
	}
}
</script>