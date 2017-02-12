<template>
	<section>
		<el-row>
			<el-col :span="6">
				<div class="grid-content">
					<div style="margin: 10px 0;text-align:left">
						<el-dropdown split-button @click="handleMainAdd" @command="handleCommand">
							新增大分类
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" :disabled="currentRow == null">编辑</el-dropdown-item>
								<el-dropdown-item command="delete" :disabled="currentRow == null">删除</el-dropdown-item>
								<el-dropdown-item command="moveup" :disabled="currentRow == null">上移↑</el-dropdown-item>
								<el-dropdown-item command="movedown" :disabled="currentRow == null">下移↓</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<el-table v-loading.body="mainLoading" :data="list" @current-change="handleCurrentChange" border style="width: 100%">
						<el-table-column type="index"></el-table-column>
						<el-table-column inline-template label="名称" property="dictValue" align="left">
							<div :class="{ 'selected': row.selected }">{{ row.dictValue }}</div>
						</el-table-column>
					</el-table>
				</div>
			</el-col>
			<el-col :span="18">
				<div class="grid-content" style="padding: 0 30px;">
					<div style="margin: 10px 0;text-align:left">
						<el-tooltip class="item" effect="dark" content="选择大分类开始管理小分类" placement="right">
							<el-button @click.native="handleSubAdd" :disabled="currentRow == null">新增小分类</el-button>
						</el-tooltip>
					</div>
					<el-table v-loading.body="subData.loading" :data="subData.list" border style="width: 100%">
						<el-table-column inline-template label="名称" align="left">
							<div>{{ row.dictValue }}</div>
						</el-table-column>
						<el-table-column inline-template label="备注" align="left">
							<div>{{ row.dictRemark }}</div>
						</el-table-column>
						<el-table-column :context="_self" inline-template label="顺序" width="150px">
							<div>
								<el-button size="small" @click="handleSubMoveUp($index, row)">上移</el-button>
								<el-button size="small" @click="handleSubMoveDown($index, row)">下移</el-button>
							</div>
						</el-table-column>
						<el-table-column :context="_self" inline-template label="操作" width="200px">
							<div>
								<el-button size="small" @click="handleSubEdit($index, row)">编辑</el-button>
								<el-button size="small" type="danger" @click="handleSubDelete($index, row)">删除</el-button>
							</div>
						</el-table-column>
					</el-table>
				</div>
			</el-col>
		</el-row>

		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="80px" :rules="formRules" ref="formData">
				<div style="position:relative">
					<mixc-upload :clientId="formData.clientId" :type="dictType" v-model="formData.dictIcon" :path="dictIconPath" title="单击上传分类图标"></mixc-upload>
					<el-form-item label="名称" prop="dictValue" class="el-form-item-left">
						<el-input v-model="formData.dictValue" auto-complete="off" :maxlength="30" placeholder="请输入名称"></el-input>
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

<style scrope>
	.selected {
		color: #2af;
		font-weight: bold;
	}
</style>

<script>
	export default {
		data() {
			let dictType = this.$router.currentRoute.path.match(/(-?\d+)\/(-?\d+)$/)[0];
			let dictParentId = this.$router.currentRoute.path.match(/(-?\d+)$/)[0];

			return {
				list: [],
				currentRow: null,

				mainLoading: false,

				subData: {
					list: [],
					loading: false
				},

				clientId: this.$store.state.client.clientId || 0,
				dictParentId: dictParentId,

				formTitle: "",
				formLoading: false,
				formVisible: false,
				formType: 0,
				dictIconPath: "/static/img/dict.png",
				formData: {
					clientId: 0,
					dictParentId: 0,
					dictId: 0,
					dictValue: "",
					dictIcon: "default_dict_icon",
					dictRemark: ""
				},
				formRules: {
					dictValue: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}]
				}
			};
		},
		created() {
			this.loadMainData();
		},
		methods: {
			loadMainData() {
				this.loadData(this.dictParentId, false);	
			},
			loadSubData() {
				this.loadData(this.currentRow.dictId, true);	
			},
			loadData(dictParentId, isSub) {
				let url = ["/api/dict/lst", this.clientId, dictParentId].join("/");
				if(isSub) {
					this.subData.loading = true
				} else {
					this.mainLoading = true
				}
				
				this.$http.get(url).then((response) => {
					if(isSub == true) {
						this.subData.loading = false;
					} else {
						this.mainLoading = false
					}
					
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							if(isSub == true) {
								this.subData.list = rst;
							} else {
								this.list = rst;
							}
						}
					}
				}, () => {
					if(isSub == true) {
						this.subData.loading = false;
					} else {
						this.mainLoading = true
					}
				});
			},

			handleCurrentChange(val, oldVal) {
				if(oldVal) {
					oldVal.selected = false;
				}
				if(val) {
					this.currentRow = val;
					val.selected = true;
					this.loadSubData();
				} else {
					if(this.currentRow) {
						this.currentRow.selected = false;
					}
					this.currentRow = null;
					this.subData.list = [];
				}
			},

			handleCommand(command) {
				switch(command) {
					case 'edit':
						this.handleMainEdit(this.currentRow);
						break;
					case 'delete':
						this.handleMainDelete();
						break;
					case 'moveup':
						this.handleMainMoveUp();
						break;
					case 'movedown':
						this.handleMainMoveDown();
						break;
					default:
						break;
				}
			},
			
			handleMainAdd() {
				this.formType = 0;
				this.handleAdd("新增大类", this.dictParentId);
			},
			
			handleSubAdd() {
				this.formType = 1;
				this.handleAdd("新增小类", this.currentRow.dictId);
			},

			handleAdd(title, dictParentId) {
				this.formTitle = title || "新增";
				this.dictIconPath = "/static/img/dict.png";
				this.formData.clientId = this.clientId;
				this.formData.dictParentId = dictParentId || dictParentId;
				this.formData.dictId = 0;
				this.formData.dictValue = "";
				this.formData.dictIcon = "default_dict_icon";
				this.formData.dictRemark = "";
				this.formVisible = true;
			},
			
			handleMainEdit(row) {
				this.formType = 0;
				this.handleEdit('编辑大类', this.currentRow);	
			},
			handleSubEdit(index, row) {
				this.formType = 1;
				this.handleEdit('编辑小类', row);	
			},
			handleEdit(title, row) {
				this.formTitle = title ||"编辑";
				this.dictIconPath = row.dictIconPath;
				this.formData.clientId = row.clientId;
				this.formData.dictParentId = row.dictParentId;
				this.formData.dictId = row.dictId;
				this.formData.dictValue = row.dictValue;
				this.formData.dictIcon = row.dictIcon;
				this.formData.dictRemark = row.dictRemark;
				this.formVisible = true;
			},
			
			handleMainDelete() {
				this.formType = 0;
				this.handleDelete(this.currentRow);
			},
			handleSubDelete(index, row) {
				this.formType = 1;
				this.handleDelete(row);
			},
			handleDelete(row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let url = ["/api/dict/delete", row.dictId].join("/")
					this.$http.delete(url).then((response) => {
						if(response.nice) {
							this.loadMainData();
							this.currentRow = null;
							this.subData.list = [];
						}
					});
				});
			},

			formSubmit() {
				this.$refs.formData.validate((valid) => {
					if(!valid) {
						return;
					}
					this.formLoading = true;
					this.$http.post('/api/dict/save', this.formData).then((response) => {
						this.formLoading = false;
						if(response.nice) {
							if(this.formType == 0) {
								this.loadMainData();
							} else {
								this.loadSubData();
							}
						}
					});
				});
			},

			handleMainMoveUp() {
				this.formType == 0;
				this.move(this.currentRow, 'moveup');
			},
			handleMainMoveDown() {
				this.formType == 0;
				this.move(this.currentRow, 'movedown');
			},
			handleSubMainMoveUp(index, row) {
				this.formType == 1;
				this.move(row, 'moveup');
			},
			handleSubMoveDown(index, row) {
				this.formType == 1;
				this.move(row, 'movedown');
			},
			move(row, action) {
				let url = ["/api/dict", action, row.dictId].join("/")
				this.$http.patch(url).then((response) => {
					if(response.nice) {
						if(this.formType == 0) {
							this.loadMainData();
						} else {
							this.loadSubData();
						}
					}
				});
			}
		}
	}
</script>