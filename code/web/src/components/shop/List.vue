<template>
	<section>
		
		<el-form :inline="true" :model="formData" class="demo-form-inline" style="text-align: left">
		  <el-form-item label="搜索：" label-width="80px">
		    <el-input v-model="formData.shopName" placeholder="输入店铺名称搜索"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-select v-model="formData.shopType" filterable clearable placeholder="店铺类型">
		      <el-option v-for="item in shopTypes" :label="item.dictValue" :value="item.dictId">
		      	<span style="float: left" :style="{ fontWeight: item.level == 0 ? 'bold': 'normal', textIndent: item.level == 0 ? '0': '1em' }">{{ item.dictValue }}</span>
		      </el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item>
		    <el-select v-model="formData.floorId" filterable clearable placeholder="所在楼层">
		      <el-option v-for="item in floors" :label="item.floorName" :value="item.floorId"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click.navtive="handleQuery" :loading="loading">查询</el-button>
		    <el-button @click.native="handleAdd">新增</el-button>
		  </el-form-item>
		</el-form>
		<el-table v-loading.body="loading" :data="shops" border style="width: 100%">
			<el-table-column type="index" label="序号" width="70" align="center" class="table-index-cell"></el-table-column>
			<el-table-column inline-template label="店铺名称" align="left">
				<div>{{ row.shopName }}</div>
			</el-table-column>
			<el-table-column inline-template label="英文名称" align="left">
				<div>{{ row.shopEnName }}</div>
			</el-table-column>
			<el-table-column inline-template label="店铺类型">
				<div>
					<el-tag type="success">{{ row.mainShopTypeText }}</el-tag>
					<el-tag type="gray">{{ row.subShopTypeText }}</el-tag>
				</div>
			</el-table-column>
			<el-table-column inline-template label="店铺位置" align="left" :show-overflow-tooltip="true">
				<div>{{ row.shopPosition }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="200px">
				<div>
					<el-button size="small" type="success" @click="handleMove($index, row)">排名</el-button>
					<el-button size="small" type="info" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="15" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
		
		
		<el-dialog :title="formTitle" v-model="formVisible" :close-on-click-modal="false">
			<el-form :model="formData" label-width="80px" ref="formData" style="position: relative;">
				<el-form-item label="排名" class="el-form-item-left">
					<el-input type="tel" v-model="formData.shopSort" auto-complete="off" :maxlength="20" :placeholder="'请输入店铺《' + formData.shopName + '》新的排名'"></el-input>
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
			let clientId = this.$store.state.client.clientId;
			return {
				clientId: clientId,
				shops: [],
				loading: false,
				formVisible: false,
				formLoading: false,
				formTitle: '设置排名',
				formData: {
					shopName: '',
					shopType: null,
					floorId: null,
				},
				currentPage: 1,
				totalCount: 0,
				
				shopTypes: [],
				floors: [],
			};
		},
		created() {
			this.page(1);
			this.loadShopTypeGroup()
			this.loadFloors()
		},
		methods: {
			page(pageNo) {
				let url = ["/api/shop/lst", this.clientId, pageNo].join("/")
				this.loading = true;
				this.$http.get(url, { params: this.formData }).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.shops = rst.list;
							this.totalCount = rst.total;
							this.currentPage = pageNo;
						}
					}
				});
			},
			
			loadFloors() {
				let url = ['/api/floor/names', this.clientId, -1].join("/");
				this.$http.get(url).then((response) => {
					if(response.data && response.data.code == 200) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.floors = response.data.rst
						}
					}
				})
			},
			
			loadShopTypeGroup() {
				let url = ['/api/dict/group', this.clientId, -1].join("/");
				this.$http.get(url).then((response) => {
					if(response.data && response.data.code == 200) {
						if(response.data.rst && response.data.rst.length > 0) {
							const group = response.data.rst
							const shopTypes = []
							group.forEach(g => {
								g.level = 0
								g.dictId += 1000000 // 后台需要减1000000,表示查询大类
								shopTypes.push(g)
								g.children.forEach(t => {
									t.level = 1
									shopTypes.push(t)
								})
							})
							this.shopTypes = shopTypes
						}
					}
				})
			},
			
			handleCurrentChange(pageNo) {
				this.page(pageNo);
			},
			
			handleAdd() {
				this.$router.push('/shop/edit/0');
			},
			handleEdit(index, row) {
				this.$router.push('/shop/edit/' + row.shopId);
			},
			handleMove(index, row) {
				this.formData.shopId = row.shopId
				this.formData.shopSort = ''
				this.formData.shopName = row.shopName
				this.formVisible = true
			},
			formSubmit(){
				const shopSort = Number(this.formData.shopSort)
				const shopId = this.formData.shopId
				if(shopSort > 0) {
					this.formLoading = true;
					const url = ['/api/shop/move', this.clientId, shopId, shopSort].join('/')
					this.$http.patch(url).then((response) => {
						this.formLoading = false
						if(response.nice) {
							this.page(this.currentPage);
						}
					});
				}
			},
			
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					this.$http.delete('/api/shop/delete/' + row.shopId).then((response) => {
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
			
			handleQuery() {
				this.page(1);
			},
		}
	}
</script>