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
			<el-table-column inline-template label="商铺名称" align="left">
				<div>{{ row.shopName }}</div>
			</el-table-column>
			<el-table-column inline-template label="英文名称" align="left">
				<div>{{ row.shopEnName }}</div>
			</el-table-column>
			<el-table-column inline-template label="商铺类型">
				<div>
					<el-tag type="success">{{ row.mainShopTypeText }}</el-tag>
					<el-tag type="gray">{{ row.subShopTypeText }}</el-tag>
				</div>
			</el-table-column>
			<el-table-column inline-template label="商铺描述" align="left" :show-overflow-tooltip="true">
				<div>{{ row.shopDesc }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="150px">
				<div>
					<el-button size="small" @click="handleEdit($index, row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="15" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				shops: [],
				loading: false,
				
				currentPage: 1,
				totalCount: 0
			};
		},
		created() {
			this.page(1);
		},
		methods: {
			page(pageNo) {
				let clientId = this.$store.state.client.clientId;
				let url = ["/api/shop/lst",  clientId, pageNo].join("/")
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