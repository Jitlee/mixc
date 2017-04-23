// 广告
(()=>{
	const template = `
		<div :id="swipeId" class="index-ads swiper-container">
			<div class="swiper-wrapper">
				<div class="swiper-slide" v-for="item in list" :style="{ backgroundImage: 'url(' + item.adsFilePath.substr(1) + ')' }"></div>
			</div>
			<div class="swiper-pagination"></div>
		</div>
	`
	
	Vue.component('mixc-index-ads', {
		template: template,
		data() {
			return {
				swiper: null,
				swipeId: 'index-ads-' + new Date().getTime()
			}
		},
		created() {
		},
		methods: {
			
			// 安装左右滑动
			setup() {
				let id = '#' + this.swipeId
				this.$nextTick(() => {
					if(this.swiper) {
						this.swiper.reLoop()
					} else {
						this.swiper = new Swiper(id,{
						    pagination: '.swiper-pagination',
						    loop: true,
						    grabCursor: true,
						    autoplay : 3000,
							speed: 200,
						    onTap: this.handleClick.bind(this),
						})
					}
				})
			},
			
			// 单击广告
			handleClick() {
				const index = this.swiper.activeIndex - 1
				const ads = this.list[index]
				if(ads) {
					this.$emit('route', ads)
				}
			},
		},
		
		computed: {
			list() {
				const ads = this.$store.state.ads
				this.setup()
				return filterArray(ads, 'adsGroupId', 44)
			}
		}
	})
})()
