<template>
	<section>
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button @click.native="handleAdd">新增楼层</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column type="index" class="table-index-cell"></el-table-column>
			<el-table-column inline-template label="楼层名称" align="left">
				<div>{{ row.floorName }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="顺序" width="150px">
				<div>
					<el-button size="small" @click="handleMoveUp($index, row)">上移</el-button>
					<el-button size="small" @click="handleMoveDown($index, row)">下移</el-button>
				</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="220px">
				<div>
					<el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
					<el-button size="small" @click="handleSub($index, row)">店铺管理</el-button>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="15" layout="total, prev, pager, next" :total="totalCount">
		</el-pagination>
		
		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="80px" :rules="formRules" ref="formData" style="position: relative;">
				<mixc-upload :clientId="clientId" :type="8" v-model="formData.navFileKey" :path="navFilePath" title="单击上传导航图"></mixc-upload>
				<el-form-item label="名称" prop="floorName" class="el-form-item-left">
					<el-input v-model="formData.floorName" auto-complete="off" :maxlength="20" placeholder="请输入楼层名称"></el-input>
				</el-form-item>
				<el-form-item label="别名" class="el-form-item-left">
					<el-input v-model="formData.floorAlias" auto-complete="off" :maxlength="20" placeholder="请输入楼层别名(楼层展示需要)"></el-input>
				</el-form-item>
				<el-form-item label="英文名" class="el-form-item-left">
					<el-input v-model="formData.floorEn" auto-complete="off" :maxlength="20" placeholder="请输入楼层英文名称(楼层展示需要)"></el-input>
				</el-form-item>
				<el-form-item label="标签" style="text-align: left;">
					<el-col :span="13">
				      <el-form-item>
				        <el-input v-model="newTag" auto-complete="off" :maxlength="10" placeholder="请输入新标签" @keyup.enter="handleNewTag"></el-input>
				      </el-form-item>
				    </el-col>
				    <el-col :span="1"></el-col>
				    <el-col :span="10">
				        <el-button @click.navtive="handleNewTag">添加</el-button>
				    </el-col>
					
					
					<el-tag v-for="(tag, index) in tags" :closable="true" :type="tag.type" :key="tag" :close-transition="false" @close="handleCloseTag(index)">{{tag.name}}</el-tag>
				</el-form-item>
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
			let clientId = this.$store.state.client.clientId
			return {
				list: [],
				loading: false,
					
				clientId: clientId,
				
				tagTypes: ['gray', 'primary', 'success', 'warning', 'danger'],
				
				currentPage: 1,
				totalCount: 0,
				buildId: 0,
				
				formTitle: '',
				formLoading: false,
				formVisible: false,
				
				tags: [],
				newTag: '',
				
				navFilePath: '/static/img/floor_nav.png',
				
				formData: {
					floorId: 0,
					buildId: 0,
					floorName: '',
					floorEn: '',
					floorAlias: '',
					floorTags: '',
					navFileKey: 'default_floor_nav_file'
				},
				formRules: {
					floorName: [
						{ required: true, message: '请输入楼层名称', trigger: 'blur' }
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
				this.loading = true
				this.$http.get(["/api/floor/lst", this.buildId, pageNo].join("/")).then((response) => {
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
				debugger
				this.formTitle = "新增楼层";
				this.formData.floorId = 0;
				this.formData.buildId = this.buildId;
				this.formData.floorName = '';
				this.formData.floorEn = '';
				this.formData.floorAlias = '';
				this.tags = [];
				//this.formData.navFileKey = 'default_floor_nav_file';
				this.navFilePath = '/static/img/floor_nav.png';
				this.formVisible = true;
			},
			handleEdit(index, row) {
				this.formTitle = "编辑楼层";
				this.formData.floorId = row.floorId;
				this.formData.buildId = row.buildId;
				this.formData.floorName = row.floorName;
				this.formData.floorEn = row.floorEn;
				this.formData.floorAlias = row.floorAlias;
				if(row.floorTags && row.floorTags.length > 0) {
					this.tags = row.floorTags.split('、').map((e) => {
						return { name: e, type: this.getTagType() }
					});
				} else {
					this.tags = [];
				}
				this.formData.navFileKey =row.navFileKey; 
				this.navFilePath = row.navFilePath;
				this.formVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					this.$http.delete(["/api/floor/delete", row.floorId].join("/")).then((response) => {
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
			handleSub(index, row) {
				this.$router.replace('/scene/floor/mgr/' + row.floorId + '/' + row.floorName)
			},
			handleMoveUp(index, row) {
				this.move(row.floorId, 'moveup');
			},
			handleMoveDown(index, row) {
				this.move(row.floorId, 'movedown');
			},
			
			move(floorId, action) {
				this.$http.patch(["/api/floor", action, floorId].join("/")).then((response) => {
					if(response.nice) {
						this.page(this.currentPage);
					}
				});
			},
			
			formSubmit() {
				this.$refs.formData.validate((valid)=>{
					if(!valid){
						return;
					}
					this.formLoading = true;
					this.formData.floorTags = this.tags.map((e) => { return e.name }).join("、");
					this.$http.post('/api/floor/save', this.formData).then((response) => {
						if(response.nice) {
							this.page(this.currentPage);
						}
					});
				});
			},
			
			getTagType() {
				return this.tagTypes[Math.floor(Math.random() * 9999) % this.tagTypes.length];
			},
			
			handleCloseTag(index) {
				this.tags.splice(index, 1);	
			},
			
			handleNewTag() {
				const newTag = this.newTag.trim();
				if(newTag) {
					this.tags.push({ name: this.newTag, type: this.getTagType() });
					this.newTag = '';
				}
			},
		}
	}
</script>