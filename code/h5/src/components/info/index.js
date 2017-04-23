(()=>{
	// 模版
	const template = `
		<div class="info clear">
			<mixc-public-header title="商场简介" sub-title="SHOPPING MALL"></mixc-public-header>
			<div class="side">
				<a v-for="(item, index) in list" @click="handleClick(index, item)" :class="{ active: item.articleId == currentArticle.articleId }">{{ item.articleTitle }}</a>
			</div>
			<div class="content" v-html="currentArticle.articleContent">
				
			</div>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-info', {
		template: template,
		data() {
			return {
				currentArticle: { articleId: 0, articleTitle: '', articleContent: '' },
				list: []
			}
		},
		created() {
			this.getArticles(articles => {
				this.list = filterArray(articles, 'articleGroupId', 53)
				if(this.list.length > 0) {
					this.currentArticle = this.list[0]
				}
			})
		}, 
		methods: {
			handleClick(index) {
				this.currentArticle = this.list[index];
			},
			
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
		}
	})
})()
