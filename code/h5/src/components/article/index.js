(()=>{
	// 模版
	const template = `
		<div class="article">
			<mixc-public-header :title="data.articleTitle" sub-title="SHOPPING MALL"></mixc-public-header>
			<div class="content" v-html="data.articleContent"></div>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-article', {
		template: template,
		data() {
			var articleId = this.$route.params.articleId || 0;
			return {
				articleId: articleId,
				data: { articleId: 0, articleTitle: '', articleContent: '' },
			}
		},
		created() {
			this.getArticles(articles => {
				const articleId = this.articleId;
				for(let i = 0, len = articles.length; i < len; i++) {
					if(articles[i].articleId == articleId) {
						this.data = articles[i];
						break;
					}
				}
			})
		},
		
		methods: {
			// 获取所有文章
			getArticles(callback) {
				if(this.$store.state.articles.length > 0) {
					callback(this.$store.state.articles)
				} else {
					PROXY.getJSON('data/article.json', (rst) => {
						if(rst && rst.length > 0) {
							this.$store.state.articles = rst
							callback(rst)
						}
					})
				}
			},
		},
	})
})()
