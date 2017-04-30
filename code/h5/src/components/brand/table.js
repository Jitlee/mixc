(()=>{
	// 模版
	const template = `
		<div class="table-view">
			<router-link :to="'/shop/0/' + item.shopId" class="table-view-cell" v-for="item in list">
				<div class="img" :style="{ backgroundImage: 'url(' + item.shopImagePath + ')' }"></div>
				<div class="info">
					<div class="icon" :style="{ backgroundImage: 'url(' + item.shopIconPath + ')' }"></div>
					<span class="name">{{ item.shopName }}</span>
					<div class="desc">{{ item.subShopTypeText }}</div>
					<div class="floor">{{ formatShopPosition(item.shopPosition) }}</div>
				</div>
			</router-link>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-brand-table', {
		template: template,
		props: {
			source: Array
		},
		data() {
			return {
				list: this.source
			}
		},
		watch: {
			'source'(val, oldValue) {
		        this.list = val;
		    }
		},
		methods: {
			
		}
	})
})()
