<style scope>
	.mixc-upload {
		width: 150px;
		height: 150px;
		border: 1px solid #c0ccda;
		border-radius: 4px;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 50% 50%;
		position: absolute;
		right: 0px;
		top: 0px;
		
		transition: border-color 0.2s ease-in-out;
		-moz-transition: border-color 0.2s ease-in-out;
		-o-transition: border-color 0.2s ease-in-out;
		-webkit-transition: border-color 0.2s ease-in-out;
		-ms-transition: border-color 0.2s ease-in-out;
	}
	
	.mixc-upload.error {
		border-color: #f20;
	}
	
	.mixc-upload.success {
		border-color: #139e13;
	}
	
	h5 {
		padding: 0;
		margin: 0;
		text-align: center;
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
</style>

<template>
	<div class="mixc-upload" :class="[{ success: state > 0 }, { error: state < 0 }]" @click="handlerFileUpload" :style="{ backgroundImage: 'url(' + currentPath + ')' }" v-loading.body="loading">
		<form ref="form" style="display: none">
			<input ref="input" type="file" accept="image/*" @change="upload($event)" name="image" style="display:none" />
		</form>
		<h5>{{ title }}</h5>
	</div>
</template>

<script>
	export default {
		name: 'mixc-upload',
		componentName: 'mixc-upload',
		props: {
			clientId: Number,
			type: Number,
			path: String,
			value: String,
			title: {
				type: String,
				default: '单击上传图片'
			}
		},
		data() {
			return {
				state: 0, // default 0, sccuess 1, error: -1
				loading: false,
				currentPath: this.path,
				currentValue: this.value,
			}
		},
		methods: {
			handlerFileUpload() {
				this.$refs.input.click();
			},
			upload(evt) {
				if(evt.target.files.length == 0) {
					return;
				}
				
				let ths = this;
				let file = evt.target.files[0];
				let reader = new FileReader();  
			    //将文件以Data URL形式读入页面  
			    reader.readAsDataURL(file);  
			    reader.onload = function(evt){
			    		ths.loading = true;
			        ths.currentPath = this.result; 
			    }  
			}
		},
		watch: {
			'value'(val, oldValue) {
		        this.currentValue = val;
		    },
			'path'(val, oldValue) {
		        this.currentPath = val;
		    },
		    'currentPath'(val) {
		    		let input = this.$refs.input;
		    		if(input.files.length == 0) {
		    			return;
		    		}
		    		let file = input.files[0];
				let formData = new FormData();
        			formData.append("image", file);
        			this.$refs.form.reset();
        			let url = ['/api/file/uploadImage', this.clientId, this.type, this.currentValue].join("/");
				this.$http.post(url, formData).then((response) => {
					if(response.nice) {
						let rst = response.data.rst;
						let fileKey = rst.fileKey;
						this.currentValue = fileKey;
						this.state = 1;
					} else {
						this.state = -1;
						this.$message.error('上传图片失败, 请检查图片格式(jpg|jpeg|png|gif)和图片文件大小(小于5M)');
					}
				});
		    },
		    'currentValue'(val) {
		        this.$emit('input', val);
		        this.$emit('change', val);
		    }
			
		}
	}
</script>