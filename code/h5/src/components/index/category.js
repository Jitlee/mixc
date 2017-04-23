(()=>{
	// 模版
	const template = `
		<div class="index-category row">
			<div v-for="(item, index) in list"
				@click="handleClick(index, item)" class="col"
				:class="{ justify: item.adsStretch == 'B' }"
				:style="{ backgroundColor: item.adsColor, backgroundImage: 'url(' + item.adsFilePath.substr(1) + ')' }"></div>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-index-category', {
		template: template,
		data() {
			return {
			}
		},
		created() {
		},
		methods: {
			handleClick(index, row) {
				// 导航
				this.$emit('route', row)
			},
		},
		
		computed: {
			list() {
				const ads = this.$store.state.ads
				return filterArray(ads, 'adsGroupId', 47)
			}
		}
	})
})()
