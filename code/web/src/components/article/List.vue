<template>
	<section>
		<el-form :inline="true" :model="formData" class="demo-form-inline" style="text-align: left">
		  <el-form-item>
		    <el-input v-model="formData.keywords" placeholder="搜索文章标题"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-select v-model="formData.groupId" placeholder="文章分组">
		      <el-option label="所有文章" value="0"></el-option>
		      <el-option v-for="group in groups" :label="group.dictValue" :value="group.dictId"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click.navtive="handleQuery" :loading="loading">查询</el-button>
		    <el-button @click.navtive="handleAdd">新增</el-button>
		  </el-form-item>
		</el-form>
		<el-table v-loading.body="loading" :data="list" border style="width: 100%">
			<el-table-column inline-template label="分组" align="left">
				<div>{{ row.articleGroup }}</div>
			</el-table-column>
			<el-table-column inline-template label="文章标题" align="left">
				<div>{{ row.articleTitle }}</div>
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
			const clientId = this.$store.state.client.clientId;
			return {
				clientId:clientId,
				list: [],
				groups: [],
				loading: false,
				
				formData: {
					keywords: '',
					groupId: '',
				},
				
				currentPage: 1,
				totalCount: 0
			};
		},
		created() {
			this.page(1);
			this.loadGroups();
		},
		methods: {
			page(pageNo) {
				let url = ["/api/article/lst",  this.clientId, this.formData.groupId || 0, pageNo].join("/")
				this.loading = true;
				this.$http.get(url, { keywords: this.formData.keywords.trim() }).then((response) => {
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
			
			loadGroups() {
				this.$http.get('/api/dict/lst/' + this.clientId + '/-3').then((response) => {
					if(response.nice) {
						this.groups = response.data.rst;
					}
				});
			},
			handleAdd() {
				debugger;
				this.$router.push('/article/edit/0');
			},
			handleEdit(index, row) {
				this.$router.push('/article/edit/' + row.articleId);
			},
			handleDelete(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(() => {
					this.$http.delete('/api/article/delete/' + row.articleId).then((response) => {
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