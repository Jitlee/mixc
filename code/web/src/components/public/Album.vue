<style scope>
	.mixc-album {
		text-align: left;
	}
	
	.mixc-album .panel {
		padding: 10px;
	}
</style>

<template>
	<div class="mixc-album" v-loading.body="loading">
		<div class="panel">
			<el-button @click.native="handleUpdload">上传图片</el-button>
			<form ref="form" style="display: none">
				<input ref="input" type="file" accept="image/*" @change="readFile($event)" name="image"  />
			</form>
		</div>
		<div>
			<mixc-card v-for="(item, index) in files" :index="index" :fileKey="item.fileKey" :title="item.fileName" :url="item.filePath" :time="item.createTime" @remove="handleRemove"></mixc-card>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'mixc-album',
		componentName: 'mixc-album',
		props: {
			clientId: Number,
			albumType: String,
			objId: Number
		},
		data() {
			return {
				loading: false,
				files: []
			}
		},
		created () {
			this.queryData()
		},
		methods: {
			queryData () {
				let url = ["/api/album/lst/", this.clientId, this.albumType, this.objId].join("/");
				this.loading = true;
				this.$http.get(url).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst) {
							this.files = rst;
						}
					}
				});
					
			},
			handleUpdload () {
				this.$refs.input.click();
			},
			readFile (evt) {
				if(evt.target.files.length == 0) {
					return;
				}
				let ths = this;
				let input = this.$refs.input;
				let file = evt.target.files[0];
				let reader = new FileReader();  
			    //将文件以Data URL形式读入页面  
			    reader.readAsDataURL(file);
			    reader.onload = function(evt){
		        		this.loading = true;
					let formData = new FormData();
	        			formData.append("image", file);
					ths.$refs.form.reset();
	        			ths.upload(formData);
			    } 
			},
			upload (formData) {
				let url = ['/api/file/uploadImage', this.clientId, 5, 0].join("/");
				this.$http.post(url, formData).then((response) => {
					if(response.nice) {
						this.saveAlbum(response.data.rst);
					} else {
						this.$message.error('上传图片失败, 请检查图片格式(jpg|jpeg|png|gif)和图片文件大小(小于5M)');
					}
				});	
			},
			
			saveAlbum ({ fileKey, fileName, filePath }) {
				let url = '/api/album/save';
				let formData = { clientId: this.clientId, albumType: this.albumType, objId: this.objId, fileKey: fileKey };
				this.loading = true;
				this.$http.post(url, formData).then((response) => {
					if(response.nice) {
						this.files.push({
							clientId: this.clientId,
							albumType: this.albumType,
							objId: this.objId,
							fileKey: fileKey,
							fileName: fileName,
							filePath: filePath
						});
					}
				});	
			},
			
			handleRemove (index, fileKey){
				let url = ['/api/album/delete', this.albumType, this.objId, fileKey].join('/');
				this.loading = true;
				this.$http.delete(url).then((response) => {
					if(response.nice) {
						this.files.splice(index, 1)
					}
				});	
			}
		}
	}
</script>