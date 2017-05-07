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
				<div class="info-floor">位置：{{ shop.shopPosition }}</div>
				<div class="desc">类型：{{ shop.subShopTypeText }}</div>
				<a @click="handleBack" class="back"><i class="iconfont icon-back"></i>&nbsp;&nbsp;返 回</a>
				<div class="qr-img"  :style="{ backgroundImage: 'url(' + shop.shopQRCodePath + ')' }"></div>
			</div>
			<div class="introduction">
				<h4>品牌介绍&nbsp;&nbsp;Brand</h4>
				<p><pre>{{ shop.shopIntroduction }}</pre></p>
			</div>
			
			<!--<img class="shop-nav" :src="shop.shopNavPath"/>-->
			<div class="map" ref="map">
				<canvas ref="canvas"></canvas>
			</div>
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
				
				floor: null,
				room: null,
				canvas: null,
				zoom: 1,
				layouted: false,
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
					if(shop.shopQRCodePath && shop.shopQRCodePath.includes('qrcode.png')) {
						shop.shopQRCodePath = ''
					}
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
			
			this.getShopRoom((floor, rooms) => {
				this.floor = floor
				this.rooms = rooms
				if(this.canvas) {
					this.layout()
				}
			})
		},
		
		mounted() {
			const roomElement = this.$refs.canvas
			roomElement.width = $(roomElement).parent().width()
			roomElement.height = $(roomElement).parent().height()
			const canvas = this.canvas = new fabric.Canvas(roomElement, {
			    hoverCursor: 'pointer',
			    selection: false,
			    perPixelTargetFind: true,
			    targetFindTolerance: 5
			})
			this.layout()
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
			
			// 获取楼层
			getFloors(callback) {
				if(this.$store.state.floors.length > 0) {
					callback(this.$store.state.floors)
				} else {
					PROXY.getJSON('data/floor.json', (rst) => {
						if(rst && rst.length > 0) {
							this.$store.state.floors = rst
							callback(rst)
						}
					})
				}
			},
			
			layout() {
				if(!(this.floor && !this.layouted)) {
					return
				}
				
				this.layouted = true
				
				this.canvas.clear()
				this.layoutBackground()
				this.layoutShop()
			},
			
			layoutBackground() {
				const canvas = this.canvas
				const center = this.canvas.getCenter()
				const backgroundImageSize = this.getAjustSize()
				this.zoom = (this.floor.fileWidth / backgroundImageSize.width) || 1	
				
				fabric.Image.fromURL(this.floor.navFilePath, function(oImg) {
					oImg.set({
						width: backgroundImageSize.width,
						height: backgroundImageSize.height,
						left: center.left,
						top: center.top,
						selectable: false,
					})
  					canvas.insertAt(oImg, 0)
				})
			},
			
			layoutShop() {
				const map =$(this.$refs.map)
				const center = this.canvas.getCenter()
				const zoom = this.zoom || 1
				const shop = this.shop
				this.rooms.forEach(r => {
					const s = $(`<a class="location"
						style="
							left:${ r.x / zoom + center.left - 25 }px;top: ${ r.y / zoom + center.top - 50 }px">
							<div class="shop-icon" style="background-image:url(${ shop.shopIconPath })"></div>
						</a>`).appendTo(map)
					setTimeout(() => {
						s.animateCss('ball')
					})
				})
			},
			
			getShopRoom(callback) {
				const shopId = this.shopId
				this.getFloors(floors => {
					for(let i = 0, iCount = floors.length; i < iCount; i++) {
						const f = floors[i]
						if(f && f.rooms && f.rooms.length > 0) {
							const rooms = f.rooms.filter(r => r.shopId == shopId)
							if(rooms && rooms.length > 0) {
								callback(f, rooms)
								return
							}
						}
					}
				})
			},
			
			getAjustSize() {
				if(this.floor.fileWidth > 0 && this.floor.fileHeight > 0) {
					if(this.canvas.width / this.canvas.height > this.floor.fileWidth / this.floor.fileHeight) {
						return { width: this.floor.fileWidth * this.canvas.height /  this.floor.fileHeight, height: this.canvas.height }
					} else {
						return { width: this.floor.fileWidth, height: this.floor.fileHeight * this.canvas.width / this.floor.fileWidth }
					}
				}
				return this.canvas
			},
		}
	})
})()
