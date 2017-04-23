(()=>{
	// 模版
	const template = `
		<nav class="index-nav clear">
			<div class="index-nav-item" v-for="(item, index) in list"
				@click.navtive="handleClick(index, item)"
				:class="{ justify: item.adsStretch == 'B' }"
				:style="{ backgroundColor: item.adsColor, backgroundImage: 'url(' + item.adsFilePath + ')' }"></div>
		</nav>
	`
	
	// 注册组件
	Vue.component('mixc-index-nav', {
		template: template,
		data() {
			return {		
			}
		},
		created() {
		},
		methods: {
			handleClick(index, row) {
				this.$emit('route', row)
			},
		},
		
		computed: {
			list() {
				const ads = this.$store.state.ads
				return filterArray(ads, 'adsGroupId', 54)
			}
		}
	})
})()
