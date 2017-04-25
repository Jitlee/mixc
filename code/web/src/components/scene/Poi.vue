<template>
	<section>
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button @click.native="handleAdd">新增公共设施</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column type="index" class="table-index-cell"></el-table-column>
			
			<el-table-column inline-template label="公共设施类型" align="left">
				<div>{{ row.poiTypeText }}</div>
			</el-table-column>
			<el-table-column inline-template label="X坐标" align="left">
				<div>{{ row.x }}</div>
			</el-table-column>
			<el-table-column inline-template label="Y坐标" align="left">
				<div>{{ row.y }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="150px">
				<div>
					<el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		
		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="100px" :rules="formRules" ref="formData">
				<div style="position:relative">
					<el-form-item label="公共设施类型" prop="poiType">
						<el-select v-model="formData.poiType" placeholder="请选公共设施类型" @change="handlePoiTypeChange">
					      	<el-option v-for="item in poiTypes" :label="item.dictValue" :value="item.dictId"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="X坐标" prop="x">
						<el-input v-model.number="formData.x" auto-complete="off" placeholder="请输入X坐标"></el-input>
					</el-form-item>
					<el-form-item label="Y坐标" prop="y">
						<el-input v-model.number="formData.y" auto-complete="off" placeholder="请输入Y坐标"></el-input>
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
		
		
		name: 'mixc-poi',
		componentName: 'mixc-poi',
		
		props: {
			pFloorId: {
				type: Number,
				default: 0
			}
		},
		
		data() {
			let floorId = this.pFloorId > 0 ? this.pFloorId : this.$route.params.floorId
			let clientId = this.$store.state.client.clientId
			return {
				list: [],
				loading: true,
				
				poiTypes: [],
				
				floorId: floorId,
				clientId: clientId,
				
				poiNamePlaceHolder: '请输入公共设施名称',
				
				formTitle: "",
				formLoading: false,
				formVisible: false,
				formData: {
					floorId: floorId,
					poiId: 0,
					poiName: '',
					poiType: '',
					x: 0,
					y: 0
				},
				formRules: {
					poiType: [
						{ required: true, type: 'integer', message: '请输入公共设施类型', trigger: 'blur' }
					],
					x: [
						{ required: true, type: 'integer', message: '请输入X坐标', trigger: 'blur' }
					],
					y: [
						{ required: true, type: 'integer', message: '请输入Y坐标', trigger: 'blur' }
					]
				}
			};
		},
		created() {
			this.loadPoiTypes();
			this.$bus.on('floor-poi', this.loadData.bind(this))
		},
		methods: {
			loadData() {
				this.loading = true
				this.$http.get(["/api/poi/lst", this.floorId].join("/")).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.list = rst;
						}
					}
				});
			},
			
			loadPoiTypes() {
				let clientId = this.$store.state.client.clientId;
				let url = ["/api/dict/lst", this.clientId, -2].join("/");
				this.$http.get(url).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.poiTypes = rst;
						}
					}
				});
			},
			
			handlePoiTypeChange(poiType) {
				let len = this.poiTypes.length;
				for(var i = 0; i < len; i++) {
					if(this.poiTypes[i].dictId == poiType) {
						this.poiNamePlaceHolder = this.poiTypes[i].dictValue
						break;
					}
				}
			},
			
			handleAdd() {
				this.formTitle = "新增公共设施";
				this.formData.floorId = this.floorId;
				this.formData.poiId = 0;
				this.formData.poiName = '';
				this.formData.poiType = '';
				this.formData.x = 0;
				this.formData.y = 0;
				this.poiNamePlaceHolder = "请输入公共设施名称";
				this.formVisible = true;
			},
			handleEdit(index, row) {
				this.formTitle = "编辑公共设施";
				this.formData.floorId = row.floorId;
				this.formData.poiId = row.poiId;
				this.formData.poiName = row.poiName;
				this.formData.poiType = row.poiType;
				this.formData.x = row.x;
				this.formData.y = row.y;
				this.formVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					this.$http.delete(["/api/poi/delete", row.poiId].join("/")).then((response) => {}, (response) => {
						if(response.nice) {
							this.loadData();
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
					
					let formData = {
						floorId: this.formData.floorId,
						poiId: this.formData.poiId,
						poiName: this.formData.poiName,
						poiType: this.formData.poiType,
						x: this.formData.x,
						y: this.formData.y
					};
					if(!formData.poiName) {
						formData.poiName = this.poiNamePlaceHolder
					}
					
					this.$http.post('/api/poi/save', formData).then((response) => {
						this.formLoading = false;
						if(response.nice) {
							this.loadData();
						}
					});
				});
			}
		}
	}
</script>