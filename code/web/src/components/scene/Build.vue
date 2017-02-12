<template>
	<section>
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button @click.native="handleAdd">新增</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column inline-template label="名称" align="left">
				<div>{{ row.dictValue }}</div>
			</el-table-column>
			<el-table-column inline-template label="键值" align="left">
				<div>{{ row.dictKey }}</div>
			</el-table-column>
			<el-table-column inline-template label="备注" align="left">
				<div>{{ row.dictRemark }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="150px">
				<div>
					<el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		
		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="80px" :rules="formRules" ref="formData">
				<div style="position:relative">
					<mixc-upload :clientId="formData.clientId" :type="3" v-model="formData.dictIcon" :path="dictIconPath" title="单击上传分类图标"></mixc-upload>
					<el-form-item label="名称" prop="dictValue" class="el-form-item-left">
						<el-input v-model="formData.dictValue" auto-complete="off" :maxlength="30" placeholder="请输入名称"></el-input>
					</el-form-item>
					<el-form-item label="键值" prop="dictKey" class="el-form-item-left">
						<el-input v-model="formData.dictKey" auto-complete="off" :maxlength="30" placeholder="请输入键值"></el-input>
					</el-form-item>
					<el-form-item label="备注" class="el-form-item-left">
						<el-input v-model="formData.dictRemark" auto-complete="off" :maxlength="100" placeholder="请输入备注"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="formSubmit" :loading="formLoading">保存</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				loading: true,
				
				clientId: 1,
				dictParentKey: this.$router.currentRoute.path.match(/\w+[^\w]*$/)[0],
				
				formTitle: "",
				formLoading: false,
				formVisible: false,
				dictIconPath: "/static/img/dict.png",
				formData: {
					clientId: 0,
					dictParentKey: "",
					dictKey: "",
					dictValue: "",
					dictIcon: "default_dict_icon",
					dictRemark: ""
				},
				formRules: {
					dictValue: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					dictKey: [
						{ required: true, message: '请输入键值', trigger: 'blur' }
					],
				}
			};
		},
		created() {
			this.loadData();
		},
		methods: {
			loadData() {
				this.$http.get(["/api/dict/lst", this.clientId, this.dictParentKey].join("/")).then((response) => {
					if(response.data && response.data.code == 200) {
						let rst = response.data.rst
						if(rst) {
							this.list = rst;
						}
					}
					
					this.loading = false;
				}, (response) => {
					this.loading = false;
				});
			},
			handleAdd() {
				this.formTitle = "新增";
				this.dictIconPath = "/static/img/dict.png";
				this.formData.clientId = this.clientId;
				this.formData.dictParentKey = this.dictParentKey;
				this.formData.dictKey = "";
				this.formData.dictValue = "";
				this.formData.dictIcon = "default_dict_icon";
				this.formData.dictRemark = "";
				this.formVisible = true;
			},
			handleEdit(index, row) {
				this.formTitle = "编辑";
				this.dictIconPath = row.dictIconPath;
				this.formData.clientId = row.clientId;
				this.formData.dictParentKey = row.dictParentKey;
				this.formData.dictKey = row.dictKey;
				this.formData.dictValue = row.dictValue;
				this.formData.dictIcon = row.dictIcon;
				this.formData.dictRemark = row.dictRemark;
				this.formVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					this.$http.delete(["/api/dict/delete", row.clientId, row.dictParentKey, row.dictKey].join("/")).then((response) => {}, (response) => {
						if(response.data && response.data.code == 200) {
							this.loadData();
							this.$message({
								message: '删除失败',
								type: 'success'
							});
						} else {
							this.$message.error('删除失败');
						}
					});
				}).catch(() => {
					this.$message.error('删除失败');
				});
			},
			
			formSubmit() {
				this.$refs.formData.validate((valid)=>{
					if(!valid){
						return;
					}
					this.formLoading = true;
					this.$http.post('/api/dict/save', this.formData).then((response) => {
						this.formLoading = false;
						if(response.data && response.data.code == 200) {
							this.formVisible = false;
							this.loadData();
							this.$message({
								message: '保存成功',
								type: 'success'
							});
						} else {
							this.$message.error('保存失败');
						}
					}, (response) => {
						this.formLoading = false;
						this.$message.error('保存失败，网络异常，请稍后再试');
					});
				});
			}
		}
	}
</script>