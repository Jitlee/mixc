<template>
	<el-form :model='formData' :rules='formRules' ref='formData' label-position='top' style='text-align: left'>
		<el-form-item label='文章分组'>
		    <el-select v-model='formData.articleGroupId' placeholder='文章分组'>
		      	<el-option label='默认分组' value=''></el-option>
		      	<el-option v-for='group in articleGroups' :label='group.dictValue' :value='group.dictId'></el-option>
		    </el-select>
	  	</el-form-item>
		<el-form-item label='文章标题' style='position: relative' prop='articleTitle'>
			<el-input v-model='formData.articleTitle' auto-complete='off' placeholder='请输入文章标题' :maxlength='50'></el-input>
		</el-form-item>
		<el-form-item label='文章内容' prop='articleContent'>
			<vue2-html5-editor :value='formData.articleContent' v-model='formData.articleContent' :height='300' :z-index='1000' :auto-height='true'></vue2-html5-editor>
		</el-form-item>
		<el-form-item>
			<el-button type='primary' @click.native='formSubmit' :loading='formLoading'>保存</el-button>
			<el-button @click='handleCancel'>取消</el-button>
		</el-form-item>
			
	</el-form>
</template>

<script>
	import Vue from 'vue'
	import VueHtml5Editor from 'vue2-html5-editor'
	import { getClientId } from '../../vuex/actions/passport'
	
	Vue.use(VueHtml5Editor, {
		name: 'vue2-html5-editor',
	   //custom icon class of built-in modules,default using font-awesome
	    icons: {
	        text: 'iconfont icon-fontstyle',
	        color: 'iconfont icon-color',
	        font: 'iconfont icon-font',
	        align: 'iconfont icon-align',
	        list: 'iconfont icon-list',
	        link: 'iconfont icon-link',
	        unlink: 'iconfont icon-unlink',
	        tabulation: 'iconfont icon-table',
	        image: 'iconfont icon-image',
	        hr: 'iconfont icon-hr',
	        eraser: 'iconfont icon-eraser',
	        undo: 'iconfont icon-undo',
	        'full-screen': 'iconfont icon-fullscreen',
	        info: 'iconfont icon-info',
	    },
	    //config image module
	    image: {
	        //Url of the server-side,default null and convert image to base64
	        server: ['/api/file/uploadImage', getClientId(), 10, 0].join('/'),
	        //the name for file field in multipart request
	        fieldName: 'image',
	        //max file size
	        sizeLimit: 512 * 1024,
	        // default true,if set to true,the image will resize by localResizeIMG (https://github.com/think2011/localResizeIMG)
	        compress: false,
	        //follows are options of localResizeIMG
	        width: 1600,
	        height: 1600,
	        quality: 80,
	        //handle response data，return image url
	        uploadHandler(reponseText){
	        		const data = window.JSON.parse(reponseText);
	        		const code = data.code;
	        		const rst = data.rst;
	        		if(code == 200 && rst && rst.filePath) {
	        			return rst.filePath;
	        		}
	        		return null;
	        }
	    },
	    hiddenModules: ['full-screen', 'info'],
	    //default en-us, en-us and zh-cn are built-in
	    language: 'zh-cn',
	    //extended modules
	    modules: {
	        //omit,reference to source code of build-in modules
	    }
	})
	export default {
		data() {
			let clientId = this.$store.state.client.clientId;
			let articleId = Number(this.$route.params.articleId || 0);
			return {
				currentTime: new Date().getTime,
				articleGroups: [],
				loading: false,
				formLoading: false,
				clientId: clientId,
				articleId: articleId,
				articleContent: '123',
				formData: {
					articleId: 0,
					clientId: clientId,
					articleTitle: '',
					articleGroupId: '',
					articleContent: '',
				},
				formRules: {
					articleTitle: [{
						required: true,
						message: '请输入文章标题',
						trigger: 'blur',
						length: 20
					}],
					articleContent: [{
						required: true,
						message: '请输入文章内容',
						trigger: 'blur'
					}],
				},
			};
		},
		created() {
			this.loadData(this.articleId);
			this.loadArticleGroups();
		},
		mounted() {
			this.formData.articleContent = '文章标题'
		},
		methods: {
			loadData(articleId) {
				if(!(articleId > 0)) {
					this.formLoading = false;
					return;
				}
				this.formLoading = true;
				this.$http.get('/api/article/info/' + articleId).then((response) => {
					if(response.nice) {
						var rst = response.data.rst
						if(rst.articleGroupId == 0) {
							rst.articleGroupId = ''
						}
						this.formData = rst;
					}
				});
			},
			loadArticleGroups() {
				let url = ['/api/dict/lst', this.clientId, -3].join('/');
				this.$http.get(url).then((response) => {
					if(response.data && response.data.code == 200) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.articleGroups = response.data.rst;
						}
					}
				});
			},
			formSubmit() {
				this.$refs.formData.validate((valid) => {
					if(!valid) {
						return
					}
					
					this.formLoading = true;
					this.$http.post('/api/article/save', this.formData).then((response) => {
						if(response.nice) {
							this.$router.go(-1);
						}
					});
				});
			},
			handleCancel() {
				this.$router.go(-1);
			},
		}
	}
</script>