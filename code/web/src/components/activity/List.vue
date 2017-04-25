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
			<el-table-column type="index"></el-table-column>
			<el-table-column inline-template label="活动标题" align="left">
				<div>{{ row.activityTitle }}</div>
			</el-table-column>
			<el-table-column inline-template label="开始日期" align="left">
				<div>{{ row.activityStartDate }}</div>
			</el-table-column>
			<el-table-column inline-template label="截止日期" align="left">
				<div>{{ row.activityEndDate }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="200px">
				<div>
					<el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="15" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
		
		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="100px" :rules="formRules" ref="formData">
				<div style="position:relative">
					<mixc-upload :clientId="formData.clientId" :type="6" v-model="formData.activityFileKey" :path="activityFilePath" title="单击上传活动图片"></mixc-upload>
					<el-form-item label="活动标题" prop="activityTitle" class="el-form-item-left">
						<el-input v-model="formData.activityTitle" auto-complete="off" :maxlength="30" placeholder="请输入名称"></el-input>
					</el-form-item>
					<el-form-item label="活动时间" required class="el-form-item-left">
						<el-col :span="11">
							<el-form-item prop="activityStartDate">
					      		<el-date-picker type="date" placeholder="选择开始日期" v-model="formData.activityStartDate" style="width: 100%;"></el-date-picker>
					    		</el-form-item>
						</el-col>
					    <el-col class="line" :span="2">-</el-col>
					    <el-col :span="11">
					    		<el-form-item prop="activityEndDate">
					      		<el-date-picker type="date" placeholder="选择结束日期" v-model="formData.activityEndDate" style="width: 100%;"></el-date-picker>
					    		</el-form-item>
					    </el-col>
					</el-form-item>
					<el-form-item label="备注" class="el-form-item-left">
						<el-input v-model="formData.activityDesc" auto-complete="off" :maxlength="400" placeholder="请输入备注"></el-input>
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
	import moment from 'moment'
	export default {
		data() {
			const clientId = this.$store.state.client.clientId;
			return {
				list: [],
				loading: false,
				currentPage: 1,
				totalCount: 0,
				
				clientId: clientId,
				formTitle: "",
				formLoading: false,
				formVisible: false,
				queryType: 0,
				activityFilePath: "/static/img/activity.png",
				
				formData: {
					clientId: clientId,
					activityId: 0,
					activityTitle: "",
					activityDesc: "",
					activityFileKey: "default_activity_image",
					activityStartDate: "",
					activityEndDate: ""
				},
				formRules: {
					activityTitle: [
						{ required: true, message: '请输入活动标题', trigger: 'blur' }
					],
					activityStartDate: [
						{ type: 'date', required: true, message: '请输入活动开始日期', trigger: 'change' }
					],
					activityEndDate: [
						{ type: 'date', required: true, message: '请输入活动结束日期', trigger: 'change' }
					]
				}
			};
		},
		created() {
			this.page(1);
		},
		methods: {
			page(pageNo) {
				let url = ["/api/activity/lst", this.clientId, this.queryType, 1].join("/");
				this.loading = true;
				this.$http.get(url).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.list = rst.list;
							this.totalCount = rst.total;
							this.currentPage = pageNo;
						}
					}
				});
			},
			
			handleCurrentChange(pageNo) {
				this.page(pageNo);
			},
			
			handleAdd() {
				this.formTitle = "新增";
				this.dictIconPath = "/static/img/dict.png";
				this.formData.clientId = this.clientId;
				this.formData.activityId = 0;
				this.formData.activityTitle = "";
				this.formData.activityDesc = "";
				this.formData.activityFileKey = "default_activity_image";
				this.activityFilePath = "/static/img/activity.png";
				this.formData.activityStartDate = new Date();
				this.formData.activityEndDate = new Date(moment().add(3, 'months').valueOf());
				this.formVisible = true;
			},
			handleEdit(index, row) {
				this.formTitle = "编辑";
				this.formData.clientId = row.clientId;
				this.formData.activityId = row.activityId;
				this.formData.activityTitle = row.activityTitle;
				this.formData.activityDesc = row.activityDesc;
				this.formData.activityFileKey =row.activityFileKey;
				this.activityFilePath =row.activityFilePath;
				this.formData.activityStartDate = new Date(moment(row.activityStartDate, 'YYYY-MM-DD').valueOf());
				this.formData.activityEndDate =  new Date(moment(row.activityEndDate, 'YYYY-MM-DD').valueOf());
				this.formVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					let url = ["/api/activity/delete", row.activityId].join("/")
					this.$http.delete(url).then((response) => {
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
					this.formData.activityStartDate = moment(this.formData.activityStartDate).format('YYYY-MM-DD');
					this.formData.activityEndDate = moment(this.formData.activityEndDate).format('YYYY-MM-DD');
					this.$http.post('/api/activity/save', this.formData).then((response) => {
						this.formLoading = false;
						if(response.nice) {
							this.page(this.currentPage);
						} 
					});
				});
			}
		}
	}
</script>