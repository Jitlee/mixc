(()=>{
	// 模版
	const template = `
		<div class="shop">
			<div :id="garryId" class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="item in shopAlbums" :style="{ backgroundImage: 'url(' + item.filePath + ')' }"></div>
				</div>
			</div>
			<div class="info">
				<div class="icon">
					<div class="icon-img" :style="{ backgroundImage: 'url(' + shop.shopIconPath + ')' }"></div>
				</div>
				<hr />
				<span class="name">品牌：<span class="red">{{ shop.shopName }}</span></span>
				<div class="info-floor">店铺位置：{{ shop.shopPosition }}</div>
				<div class="desc">类型：{{ shop.subShopTypeText }}</div>
				<a @click="handleBack" class="back"><i class="iconfont icon-back"></i>&nbsp;&nbsp;返 回</a>
				<div class="qr-img"  :style="{ backgroundImage: 'url(' + shop.shopQRCodePath + ')' }"></div>
			</div>
			<div class="introduction">
				<h4>品牌介绍&nbsp;&nbsp;Brand</h4>
				<p><pre>{{ shop.shopIntroduction }}</pre></p>
			</div>
			
			<img class="shop-nav" :src="shop.shopNavPath"/>
			
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-shop', {
		template: template,
		data() {
			const shopId = this.$route.params.shopId
			return {
				shopId: shopId,
				garryId: 'shopAbums' + shopId,
				shop: {
					shopName: '',
					shopPosition: '',
					shopDesc: '',
					shopIconPath: '',
					shopQRCodePath: '',
					shopImagePath: '',
					shopNavPath: '',
					shopIntroduction: '',
				},
				shopAlbum: '',
				shopAlbums: [],
				swiper: null,
			}
		},
		created() {
			this.getShops(shops => {
				let shop = null
				for(let i = 0, iCount = shops.length; i < iCount; i++) {
					if(shops[i].shopId == this.shopId) {
						shop = shops[i]
						break
					}
				}
				if(shop) {
					this.shop = shop
					if(this.shopAlbum == '') {
						this.shopAlbum = this.shop.shopImagePath
					}
				}
			})
			
			this.getAlbumByType('shop', this.shopId, albums => {
				if(albums.length == 0) {
					albums.push(this.shop.shopImagePath)
				}
				this.shopAlbums = albums
				this.$nextTick(() => {
					this.setup()
				})
			})
		},
		
		methods: {
			handleBack() {
				if(this.$route.params.type == 0) {
					this.$router.go(-1)
				} else {
					this.$router.replace('/')
				}
			},
			setup() {
				if(this.swiper) {
					return
				}
				this.swiper = new Swiper('#' + this.garryId,{
				    loop: true,
				    grabCursor: true,
				    paginationClickable: true,
				    grabCursor: true,
				    autoplay : 5000,
					speed: 500,
				})
			},
			
			// 获取商铺
			getShops(callback) {
				if(this.$store.state.shops.length > 0) {
					callback(this.$store.state.shops)
				} else {
					PROXY.getJSON('data/shop.json', (rst) => {
						if(rst && rst.length > 0) {
							this.$store.state.shops = rst
							callback(rst)
						}
					})
				}
			},
			
			// 获取相册
			getAlbums(callback) {
				if(this.$store.state.albums.length > 0) {
					callback(this.$store.state.albums)
				} else {
					PROXY.getJSON('data/album.json', (rst) => {
						if(rst && rst.length > 0) {
							this.$store.state.albums = rst
							callback(rst)
						}
					})
				}
			},
			
			getAlbumByType(albumType, objId, callback) {
				this.getAlbums(albums => {
					const result = [];
					for(let i = 0, len = albums.length; i < len; i++) {
						if(albums[i].albumType == albumType && albums[i].objId == objId) {
							result.push(albums[i])
						}
					}
					callback(result)
				});
			},
		}
	})
})()
