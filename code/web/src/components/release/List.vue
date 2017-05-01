<template>
	<section>
		<el-alert title="温馨提示：发布版本后，需要设置版本状态为已启用才能生效" type="warning" show-icon style="text-align: left; margin-bottom: 10px"></el-alert>
		
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					<el-button type="primary" :loading="loading" @click.native="handleAdd">发布新版本</el-button>
				</div>
			</el-col>
		</el-row>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column type="index" label="序号" width="70" align="center" class="table-index-cell"></el-table-column>
			<el-table-column inline-template label="发布版本" align="left">
				<div>{{ row.releaseVersion }}</div>
			</el-table-column>
			<el-table-column inline-template label="发布日期" align="left">
				<div>{{ row.createTime }}</div>
			</el-table-column>
			<el-table-column inline-template label="状态"  width="80px">
				<i class="el-icon-circle-check" style="font-size: 18px; cursor: pointer" :style="{ color: row.isEnabled ? '#00b642' : '#999' }" @click="handleEnabled($index, row)"></i>
    			</el-table-column>
			<el-table-column inline-template label="发布时间">
				<div>{{ row.createTime }}</div>
			</el-table-column>
			<el-table-column :context="_self" inline-template label="操作" width="200px">
				<div>
					<el-button size="small"  @click="handleDownload($index, row)" :disabled="row.isDeleted">下载</el-button>
					<el-button size="small"  @click="handlePreview($index, row)" :disabled="row.isDeleted">预览</el-button>
					<el-button size="small" type="danger" @click="handleDelete($index, row)" :disabled="row.isDeleted">删除</el-button>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="15" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
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
			};
		},
		created() {
			this.page(1);
		},
		methods: {
			page(pageNo) {
				let url = ["/api/release/lst", this.clientId, this.queryType, 1].join("/");
				this.loading = true;
				this.$http.get(url).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.list = rst.list
							this.totalCount = rst.total
							this.currentPage = pageNo
						}
					}
				});
			},
			
			handleCurrentChange(pageNo) {
				this.page(pageNo);
			},
			
			handleAdd() {
				this.$confirm('确认发布新版本吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					this.loading = true;
					let url = ["/api/release/publish", this.clientId, this.$store.state.client.defaultSceneId||1].join("/")
					this.$http.post(url).then((response) => {
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
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					let url = ["/api/release/delete", row.releaseId].join("/")
					this.loading = true
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
			
			handleDownload(index, row) {
				window.open('/' +row.releaseFile);
			},
			
			handlePreview(index, row) {
				window.open('/release/'+row.releaseVersion+'/index.html');
			},
			handleEnabled(index, row) {
				this.loading = true
				let url = ["/api/release/enable", row.releaseId, row.isEnabled ? 0 : 1].join("/")
				this.$http.patch(url).then((response) => {
					if(response.nice) {
						row.isEnabled = !row.isEnabled
					}
				});
			}
		}
	}
</script>