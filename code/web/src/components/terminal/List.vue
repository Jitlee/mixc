<template>
	<section>
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button @click.native="handleAdd">新增</el-button>
					<el-button @click.native="handleRefresh">刷新</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column inline-template label="客户端名称" align="left">
				<div>{{ row.tmlName }}</div>
			</el-table-column>
			<el-table-column inline-template label="所在楼层" align="left">
				<div>{{ row.floorName }}</div>
			</el-table-column>
			<el-table-column inline-template label="客户端MAC地址" align="left">
				<div>{{ row.tmlMac }}</div>
			</el-table-column>
			<el-table-column inline-template label="客户端IP" align="left">
				<div>{{ row.tmlIp }}</div>
			</el-table-column>
			<el-table-column inline-template label="定时关机时间" align="left">
				<div>{{ row.shutdownTimeText }}</div>
			</el-table-column>
			<el-table-column inline-template label="上次启动时间" align="left">
				<div>{{ row.onlineTime }}</div>
			</el-table-column>
			<el-table-column inline-template label="状态" align="left">
				<div>{{ row.isActive }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="150px">
				<div>
					<el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="15" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
		
		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="150px" :rules="formRules" ref="formData">
				<div style="position:relative">
					<el-form-item label="客户端名称" prop="tmlName" class="el-form-item-left">
						<el-input v-model="formData.tmlName" auto-complete="off" :maxlength="30" placeholder="请输入名称"></el-input>
					</el-form-item>
					<el-form-item label="所在楼层" prop="floorId" class="el-form-item-left">
						<el-select v-model="formData.floorId" placeholder="请选择">
						    <el-option v-for="item in floors" :label="item.floorName" :value="item.floorId"></el-option>
						    	</el-option-group>
					  	</el-select>
					</el-form-item>
					<el-form-item label="客户端MAC地址" prop="tmlMac" class="el-form-item-left">
						<el-input v-model="formData.tmlMac" auto-complete="off" :maxlength="30" placeholder="请输入MAC地址"></el-input>
					</el-form-item>
					<el-form-item label="客户端IP" class="el-form-item-left">
						<el-input v-model="formData.tmlIp" auto-complete="off" :maxlength="30" placeholder="请输入IP地址"></el-input>
					</el-form-item>
					<el-form-item label="定时关机时间" class="el-form-item-left" style="text-align: left">
						<el-time-select v-model="shutdownTime" :picker-options="{ start: '08:00', step: '00:15', end: '23:30' }" placeholder="选择时间"></el-time-select>
					</el-form-item>
					<el-form-item label="客户端品牌" class="el-form-item-left">
						<el-input v-model="formData.tmlBrand" auto-complete="off" :maxlength="30" placeholder="请输入品牌"></el-input>
					</el-form-item>
					<el-form-item label="客户端型号" class="el-form-item-left">
						<el-input v-model="formData.tml" auto-complete="off" :maxlength="30" placeholder="请输入型号"></el-input>
					</el-form-item>
					<el-form-item label="X坐标" prop="x" class="el-form-item-left">
						<el-input v-model="formData.x" auto-complete="off" :maxlength="30" placeholder="请输入X坐标"></el-input>
					</el-form-item>
					<el-form-item label="Y坐标" prop="y" class="el-form-item-left">
						<el-input v-model="formData.y" auto-complete="off" :maxlength="30" placeholder="请输入Y坐标"></el-input>
					</el-form-item>
					<el-form-item label="备注" class="el-form-item-left">
						<el-input v-model="formData.tmlDesc" auto-complete="off" :maxlength="100" placeholder="请输入备注"></el-input>
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
			const clientId = this.$store.state.client.clientId
			const buildId = this.$store.state.client.defaultBuildId
			return {
				list: [],
				loading: false,
				currentPage: 1,
				totalCount: 0,
				
				clientId: clientId,
				buildId: buildId,
				formTitle: "",
				formLoading: false,
				formVisible: false,
				
				shutdownTime: '21:00',
				formData: {
					tmlId: 0,
					clientId: clientId,
					floorId: '',
					tmlName: '',
					tmlIp: '',
					tmlMac: '',
					tmlBrand: '',
					tmlModel: '',
					tmlDesc: '',
					shutdownTime: 540,
					x: 0,
					y: 0,
					
				},
				formRules: {
					tmlName: [
						{ required: true, message: '请输入活动标题', trigger: 'blur' }
					],
					tmlMac: [
						{ required: true, message: '请输入MAC地址', trigger: 'blur' }
					],
					floorId: [
						{ type: 'number', required: true, message: '请选择所在楼层', trigger: 'change' }
					]
				},
				
				floors: [],
			};
		},
		created() {
			this.page(1);
		},
		methods: {
			page(pageNo) {
				let url = ["/api/terminal/lst", this.clientId].join("/");
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
					this.loadFloors();
				});
			},
			
			loadFloors() {
				if(this.floors.length > 0) {
					return
				}
				let url = ["/api/floor/all", this.buildId].join("/");
				this.$http.get(url).then((response) => {
					if(response.nice) {
						const rst = response.data.rst
						if(rst) {
							this.floors = rst;
						}
					}
				});
			},
			
			handleCurrentChange(pageNo) {
				this.page(pageNo);
			},
			
			handleRefresh() {
				this.page(1);
			},
			
			handleAdd() {
				this.formTitle = "新增";
				this.formData.tmlId = 0;
				this.formData.floorId = '';
				this.formData.tmlName = '';
				this.formData.tmlMac = '';
				this.formData.tmlIp = '';
				this.formData.tmlBrand = '';
				this.formData.tmlModel = '';
				this.formData.tmlDesc = '';
				this.formData.shutdownTime = 540;
				this.shutdownTime = '21:00';
				this.formData.x = 0;
				this.formData.y = 0;
				this.formVisible = true;
			},
			handleEdit(index, row) {
				this.formTitle = "编辑";
				this.formData.tmlId = row.tmlId;
				this.formData.floorId = row.floorId;
				this.formData.tmlName = row.tmlName;
				this.formData.tmlMac = row.tmlMac;
				this.formData.tmlIp = row.tmlIp;
				this.formData.tmlBrand = row.tmlBrand;
				this.formData.tmlModel = row.tmlModel;
				this.formData.tmlDesc = row.tmlDesc;
				this.formData.shutdownTime = row.shutdownTime;
				this.shutdownTime = this.stringWithMinutes(row.shutdownTime);
				this.x = row.x;
				this.y = row.y;
				this.formVisible = true;
			},
			stringWithMinutes(mintues) {
				return ('0' + String(Math.floor(mintues/60))).replace(/^0(\d\d)$/, '$1') + ':' + ('0' + String(mintues%60)).replace(/^0(\d\d)$/, '$1')
			},
			minutesWithString(time) {
				const arr = time.split(':')
				return Number(arr[0]) * 60 + Number(arr[1])
			},
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					let url = ["/api/terminal/delete", row.tmlId].join("/")
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
					this.formData.shutdownTime = this.minutesWithString(this.shutdownTime)
					this.$http.post('/api/terminal/save', this.formData).then((response) => {
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