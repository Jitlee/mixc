<template>
	<section>
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button @click.native="handleAdd">新增</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="shops" border style="width: 100%">
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
			<el-table-column inline-template label="店铺特色" align="left" :show-overflow-tooltip="true">
				<div>{{ row.shopDesc }}</div>
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
					shopId: 0,
					shopName: '',
					shopSort: '',
				},
				
				currentPage: 1,
				totalCount: 0
			};
		},
		created() {
			this.page(1);
		},
		methods: {
			page(pageNo) {
				let url = ["/api/shop/lst", this.clientId, pageNo].join("/")
				this.loading = true;
				this.$http.get(url).then((response) => {
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
		}
	}
</script>