<template>
	<section>
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button @click.native="handleAdd">新增店铺房间</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column type="index" label="序号" width="70" align="center" class="table-index-cell"></el-table-column>
			<el-table-column inline-template label="店铺房间名称" align="left">
				<div>{{ row.roomName }}</div>
			</el-table-column>
			<el-table-column inline-template label="入驻店铺" align="left">
				<div>{{ row.shopName }}</div>
			</el-table-column>
			<el-table-column inline-template label="入驻店铺位置" align="left">
				<div>{{ row.shopPosition }}</div>
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
					<el-form-item label="房间名称" prop="roomName">
						<el-input v-model="formData.roomName" auto-complete="off" :maxlength="30" placeholder="请输入房间名称"></el-input>
					</el-form-item>
					<el-form-item label="入驻店铺">
						<el-select v-model="formData.shopId" placeholder="请选入驻店铺">
							<el-option label="请选入驻店铺" :value="0"></el-option>
					      	<el-option v-for="item in shops" :label="item.shopName" :value="item.shopId"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="X坐标" prop="x">
						<el-input v-model="formData.x" type="number" auto-complete="off" placeholder="请输入X坐标"></el-input>
					</el-form-item>
					<el-form-item label="Y坐标" prop="y">
						<el-input v-model="formData.y" type="number" auto-complete="off" placeholder="请输入Y坐标"></el-input>
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
		
		name: 'mixc-room',
		componentName: 'mixc-room',
		
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
				
				floorId: floorId,
				shops: [],
				clientId: clientId,
				
				formTitle: '',
				formLoading: false,
				formVisible: false,
				formData: {
					floorId: floorId,
					roomId: 0,
					roomName: '',
					shopId: '',
					x: 0,
					y: 0
				},
				formRules: {
					x: [
						{ required: true, message: '请输入X坐标' },
						{ type: 'number', message: '坐标X必须为数字' }
					],
					y: [
						{ required: true, message: '请输入y坐标' },
						{ type: 'number', message: '坐标Y必须为数字' }
					]
				}
			};
		},
		created() {
			this.loadShops()
			this.loadData()
			this.$bus.on('floor-map', this.loadData.bind(this))
		},
		methods: {
			loadData() {
				this.loading = true
				this.$http.get(["/api/room/lst", this.floorId].join("/")).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.list = rst;
						}
					}
				});
			},
			
			loadShops() {
				this.$http.get(["/api/shop/all", this.clientId].join("/")).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.shops = rst
						}
					}
				});
			},
			
			handleAdd() {
				this.formTitle = "新增店铺房间";
				this.formData.floorId = this.floorId;
				this.formData.roomId = 0;
				this.formData.shopId = '';
				this.formData.roomName = '';
				this.formData.x = 0;
				this.formData.y = 0;
				this.formVisible = true;
			},
			handleEdit(index, row) {
				this.formTitle = "编辑店铺房间";
				this.formData.floorId = row.floorId;
				this.formData.roomId = row.roomId;
				this.formData.shopId = row.shopId;
				this.formData.roomName = row.roomName;
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
					this.$http.delete(["/api/room/delete", row.roomId].join("/")).then((response) => {}, (response) => {
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
					this.$http.post('/api/room/save', this.formData).then((response) => {
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