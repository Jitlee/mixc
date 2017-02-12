<template>
	<section>
		<el-alert title="温馨提示：分组内可以用设置开始日期来排序" type="success" show-icon style="text-align: left; margin-bottom: 10px"></el-alert>
		
		<el-form :inline="true" :model="queryData" class="demo-form-inline" style="text-align: left">
		  <el-form-item>
		    <el-select v-model="queryData.groupId" placeholder="广告分组">
		      <el-option label="所有广告" value="0"></el-option>
		      <el-option v-for="group in groups" :label="group.dictValue" :value="group.dictId"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click.navtive="handleQuery" :loading="loading && loadingCount <= 0">查询</el-button>
		    <el-button @click.navtive="handleAdd">新增</el-button>
		  </el-form-item>
		</el-form>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column inline-template label="分组名称" align="left">
				<div>{{ row.adsGroup }}</div>
			</el-table-column>
			<el-table-column inline-template label="广告标题" align="left">
				<div>{{ row.adsTitle }}</div>
			</el-table-column>
			<el-table-column inline-template label="链接类型" align="left">
				<div>{{ row.adsTarget }}</div>
			</el-table-column>
			<el-table-column inline-template label="开始日期" align="left">
				<div>{{ row.adsStartDate }}</div>
			</el-table-column>
			<el-table-column inline-template label="截止日期" align="left">
				<div>{{ row.adsEndDate }}</div>
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
					<mixc-upload :clientId="formData.clientId" :type="12" v-model="formData.adsFileKey" :path="adsFilePath" title="单击上传广告图片" :style="{ backgroundColor: formData.adsColor }"></mixc-upload>
					<el-form-item label='广告分组' class="el-form-item-left" prop="adsGroupId">
					    <el-select v-model='formData.adsGroupId' placeholder='文章分组'>
					      	<el-option v-for='group in groups' :label='group.dictValue' :value='group.dictId'></el-option>
					    </el-select>
				  	</el-form-item>
					<el-form-item label="广告标题" prop="adsTitle" class="el-form-item-left">
						<el-input v-model="formData.adsTitle" auto-complete="off" :maxlength="30" placeholder="请输入名称"></el-input>
					</el-form-item>
					<el-form-item label="广告时间" required class="el-form-item-left">
						<el-col :span="11">
					    		<el-form-item prop="adsStartDate">
					      		<el-date-picker type="date" placeholder="选择开始日期" v-model="formData.adsStartDate" style="width: 100%;"></el-date-picker>
				      		</el-form-item>
					    </el-col>
					    <el-col class="line" :span="2">-</el-col>
					    <el-col :span="11">
					    		<el-form-item prop="adsEndDate">
					      		<el-date-picker type="date" placeholder="选择结束日期" v-model="formData.adsEndDate" style="width: 100%;"></el-date-picker>
					      	</el-form-item>
					    </el-col>
					</el-form-item>
					<el-form-item label='广告链接' class="el-form-item-left" required>
						<el-col :span="11">
							<el-form-item prop="adsTargetType">
							    <el-select v-model='formData.adsTargetType' placeholder='链接类型'>
							      	<el-option v-for='type in types' :label='type.dictValue' :value='type.dictId'></el-option>
							    </el-select>
						    </el-form-item>
					    </el-col>
					    <el-col :span="2">-</el-col>
					    <el-col :span="11">
					    		<el-form-item prop="adsTargetId">
						    		<el-select v-model='formData.adsTargetId' placeholder='链接目标'>
							      	<el-option label='请选择' :value='0'></el-option>
							      	<el-option v-for='target in targets' :label='target.text' :value='target.id'></el-option>
							    </el-select>
						    </el-form-item>
					    </el-col>
				  	</el-form-item>
				  	<hr />
					<el-form-item label="广告背景色(可选)">
						<el-input v-model="formData.adsColor" auto-complete="off" :maxlength="15" placeholder="请输入背景色" style="margin-bottom:10px;"></el-input>
						<compact-picker v-model="formData.adsColor" @change-color="handleColorChange"></compact-picker>
					</el-form-item>
					<el-form-item label="图片填充  (可选)">
						<el-select v-model="formData.adsStretch" placeholder="填充方式">
					      	<el-option label="剪裁填充" value="A"></el-option>
					      	<el-option label="刚好填充" value="B"></el-option>
					      	<el-option label="拉伸铺满" value="C"></el-option>
					      	<el-option label="原始大小" value="D"></el-option>
					    </el-select>
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
	
	import Vue from 'vue'
	import { Compact } from 'vue-color'
	
	let defaultProps = { hex: '#FFFFFF', hsl: { h: 0, s: 0, l: 1, a: 1 }, hsv: { h: 0, s: 0, v: 1, a: 1 }, rgba: { r: 255, g: 255, b: 255, a: 1 }, a: 1 }

	export default {
		data() {
			const clientId = this.$store.state.client.clientId;
			return {
				list: [],
				loading: false,
				
				loadingCount: 7,
				
				currentPage: 1,
				totalCount: 0,
				
				clientId: clientId,
				formTitle: "",
				formLoading: false,
				formVisible: false,
				queryData: {
					groupId: '',
				},
				adsFilePath: '/static/img/ads.png',
				
				shops: [],
				shopTypes: [],
				articles: [],
				activities: [],
				
				targetFlag: true,
				
				groups: [],
				types: [],
				targets: [],
				
				formData: {
					clientId: clientId,
					adsId: 0,
					adsTitle: '',
					adsGroupId: '',
					adsTargetType: '',
					adsTargetId: '',
					adsStretch: 'A',
					adsColor: '#FFFFFF',
					adsFileKey: 'default_ads_image',
					adsStartDate: '',
					adsEndDate: ''
				},
				formRules: {
					adsGroupId: [
						{ type: 'number', required: true, message: '请输入广告分组', trigger: 'change' }
					],
					adsTitle: [
						{ required: true, message: '请输入广告标题', trigger: 'blur' }
					],
					adsStartDate: [
						{ type: 'date', required: true, message: '请输入广告开始日期', trigger: 'change' }
					],
					adsEndDate: [
						{ type: 'date', required: true, message: '请输入广告结束日期', trigger: 'change' }
					],
					adsTargetType: [
						{ type: 'number', required: true, message: '请输入链接类型', trigger: 'change' }
					],
				}
			};
		},
		created() {
			this.page(1);
			this.loadGroups();
			this.loadTargetTypes();
			this.loadShops();
			this.loadShopTypes();
			this.loadArticles();
			this.loadActivities();
		},
		components: { 'compact-picker': Compact },
		methods: {
			page(pageNo) {
				let url = ['/api/ads/lst', this.clientId, 0, this.queryData.groupId || 0, 1].join('/');
				this.loading = true;
				this.$http.get(url).then((response) => {
					this.loadingCount--;
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
			
			loadGroups() {
				const url = ['/api/dict/lst', this.clientId, -4].join('/');
				this.$http.get(url).then((response) => {
					this.loadingCount--;
					if(response.nice) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.groups = response.data.rst;
						}
					}
				});
			},
			
			loadTargetTypes() {
				const url = ['/api/dict/lst', 0, -5].join('/');
				this.$http.get(url).then((response) => {
					this.loadingCount--;
					if(response.nice) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.types = response.data.rst;
						}
					}
				});
			},
			
			loadShopTypes() {
				const url = ['/api/dict/lst', this.clientId, -1].join('/');
				this.$http.get(url).then((response) => {
					this.loadingCount--;
					if(response.nice) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.shopTypes = response.data.rst;
						}
					}
				});
			},
			
			loadShops() {
				const url = ['/api/shop/all', this.clientId].join('/');
				this.$http.get(url).then((response) => {
					this.loadingCount--;
					if(response.nice) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.shops = response.data.rst;
						}
					}
				});
			},
			
			loadArticles() {
				const url = ['/api/article/all', this.clientId].join('/');
				this.$http.get(url).then((response) => {
					this.loadingCount--;
					if(response.nice) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.articles = response.data.rst;
						}
					}
				});
			},
			
			loadActivities() {
				const url = ['/api/activity/all', this.clientId].join('/');
				this.$http.get(url).then((response) => {
					this.loadingCount--;
					if(response.nice) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.activities = response.data.rst;
						}
					}
				});
			},
			
			handleColorChange(val) {
				this.formData.adsColor = val.hex;	
			},
			
			handleQuery() {
				this.page(1);
			},
			
			handleCurrentChange(pageNo) {
				this.page(pageNo);
			},
			
			handleAdd() {
				this.formTitle = '新增';
				this.dictIconPath = '/static/img/dict.png';
				this.formData.clientId = this.clientId;
				this.formData.adsId = 0;
				this.formData.adsGroupId = '';
				this.formData.adsTitle = '';
				this.formData.adsTargetType = '';
				this.formData.adsTargetId = '';
				this.formData.adsColor = '#FFFFFF';
				this.formData.adsStretch = 'A';
				this.formData.adsFileKey = 'default_ads_image';
				this.adsFilePath = '/static/img/ads.png';
				this.formData.adsStartDate = new Date();
				this.formData.adsEndDate = new Date(moment().add(3, 'months').valueOf());
				this.formVisible = true;
			},
			handleEdit(index, row) {
				this.formTitle = '编辑';
				this.targetFlag = false;
				this.formData.adsId = row.adsId;
				this.formData.clientId = row.clientId;
				this.formData.adsGroupId = row.adsGroupId;
				this.formData.adsTitle = row.adsTitle;
				this.formData.adsTargetType = row.adsTargetType;
				this.formData.adsTargetId = row.adsTargetId;
				this.formData.adsColor = row.adsColor;
				this.formData.adsStretch = row.adsStretch;
				this.formData.adsFileKey =row.adsFileKey;
				this.adsFilePath = row.adsFilePath;
				this.formData.adsStartDate = new Date(moment(row.adsStartDate, 'YYYY-MM-DD').valueOf());
				this.formData.adsEndDate = new Date(moment(row.adsEndDate, 'YYYY-MM-DD').valueOf());
				this.formVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					let url = ['/api/ads/delete', row.adsId].join('/')
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
					this.formData.adsStartDate = moment(this.formData.adsStartDate).format('YYYY-MM-DD');
					this.formData.adsEndDate = moment(this.formData.adsEndDate).format('YYYY-MM-DD');
					this.$http.post('/api/ads/save', this.formData).then((response) => {
						this.formLoading = false;
						if(response.nice) {
							this.page(this.currentPage);
						} 
					});
				});
			},
		},
		watch: {
			'formData.adsTargetType'(val, oldVal) {
				if(val == -1) {
					this.targets = this.shops.map((t) => { return { id: t.shopId, text: t.shopName } })
				} else if(val == -2) {
					this.targets = this.shopTypes.map((t) => { return { id: t.dictId, text: t.dictValue } })
				} else if(val == -3) {
					this.targets = this.articles.map((t) => { return { id: t.articleId, text: t.articleTitle } })
				} else if(val == -4) {
					this.targets = this.activities.map((t) => { return { id: t.activityId, text: t.activityTitle } })
				}  else {
					this.targets = [];
				}
				
				if(this.targetFlag) {
					this.formData.adsTargetId = '';
				} else {
					this.targetFlag = true;
				}
			}
		}
	}
</script>