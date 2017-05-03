(()=>{
	// 模版
	const template = `
		<div class="floor">
			<mixc-public-header title="楼层导购" sub-title="FLOOR NAVIGATION"></mixc-public-header>
			<div class="lenged">
				<div class="lenged-item" @click="handleLenged('A')"><i class="iconfont icon-lift"></i></div>
				<div class="lenged-item" @click="handleLenged(['B', 'C', 'D'])"><i class="iconfont icon-stail"></i></div>
				<div class="lenged-item" @click="handleLenged(['E'])"><i class="iconfont icon-wc"></i></div>
			</div>
			<div class="img" ref="map">
				<canvas ref="canvas"></canvas>
			</div>
			<div class="floors row">
				<div class="title">楼层选择：</div>
				<div class="col floor-col" @click="handlePrev"><i class="iconfont icon-prev"></i></div>
				<div class="col floor-col" v-for="(item,index) in floors" :class="{ active: item.floorId === floor.floorId }" @click="handleClick(index)">{{ item.floorName }}</div>
				<div class="col floor-col" @click="handleNext"><i class="iconfont icon-next"></i></div>
			</div>
			<div class="info">
				<div class="build">A-栋</div>
				<div class="name">{{ floor.floorName }}</div>
				<div class="alias">{{ floor.floorAlias }}</div>
				<div class="en">{{ floor.floorEn }}</div>
				<div class="tag" v-for="tag in floor.tags">{{ tag }}</div>
			</div>
			<div class="shops clear">
				<h5>
					本层店铺：
					<a class="search" @click.navtive="handleShowLetters()"><i class="iconfont icon-search" ></i></a>
				</h5>
				<div class="letters" ref="letters" style="display:none">
					<a class="letter" v-for="(letter, index) in letters" 
						@click="handleFilter(letter, index)">{{ letter }}</a>
				</div>
				<div :id="swipeId" class="floor swiper-container">
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="shops in pages">
							<a class="shop-item" v-for="shop in shops" :id="'floor_shop_' + shop.shopId" @click="handleClickShop(shop)">{{ shop.shopName }}</a>
						</div>
					</div>
					<div class="pagination" v-show="pages.length > 1"></div>
				</div>
			</div>
		</div>
	`
	
	fabric.Object.prototype.originX = 'center'
	fabric.Object.prototype.originY = 'center'
	
	// 注册组件
	Vue.component('mixc-floor', {
		template: template,
		data() {
			return {
				index: -1,
				start: 0,
				pageSize: 5,
				floor: {
					floorId: 0,
					floorName: '',
					floorAlias: '',
					floorEn: '',
					tags: [],
					navFilePath: '',
					rooms: []
				},
				
				allFloors: [],
				floors: [],
				pages: [],
				letters: Array.apply(null, {length:26}).map((e, i) => { return String.fromCharCode(65 + i) }),
				
				swiper: null,
				swipeId: 'floor-' + new Date().getTime(),
				
				_lettersVisible: this.$store.state.floor._lettersVisible,
				_selectedLetter: this.$store.state.floor._selectedLetter,
				
				canvas: null,
				zoom: 1,
			}
		},
		created() {
			this.getFloors((rst)=> {
				this.allFloors = rst
				this.setupFloors(this.$store.state.floor.index)
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
			
			// 获取兴趣点
			getPois(callback) {
				if(this.$store.state.pois.length > 0) {
					callback(this.$store.state.pois)
				} else {
					PROXY.getJSON('data/poi.json', (rst) => {
						if(rst && rst.length > 0) {
							this.$store.state.pois = rst
							callback(rst)
						}
					})
				}
			},
			
			
			getPoisByFloorId(floorId, callback) {
				this.getPois(pois => {
					const result = filterArray(pois, 'floorId', floorId)
					callback(result)
				});
			},
			
			// 根据楼层搜索商铺
			filterShops(floor, callback) {
				if(floor.shops) {
					if(floor.shops.length > 0) {
						callback(floor.shops)
					}
				} else {
					const roomIds = floor.rooms.map(r => { return Number(r.shopId) })
					this.getShops(shops => {
						const shopIds = new Set()
						const result = []
						shops.forEach(s => {
							if(!shopIds.has(s.shopId) && roomIds.includes(s.shopId)) {
								result.push(s)
							}
						})
						shopIds.clear()
						floor.shops = result
						if(result.length > 0) {
							callback(result)
						}
					})
				}
			},
			
			// 上一层
			handlePrev () {
				this.setupFloors(this.index - 1, true);
			},
			// 下一层
			handleNext () {
				this.setupFloors(this.index + 1, false);
			},
			
			// 单击楼层
			handleClick(index) {
				this.setupFloors(index + this.start);
			},
			
			// 安装楼层
			setupFloors (index, isReverse) {
				const floors = this.allFloors;
				if(this.index != index && index > -1 && index < floors.length) {
					this.index = index;
					this.$store.state.floor.index = index
					let floor = floors[index];
					if(!floor.tags) {
						floor.tags = (floor.floorTags && floor.floorTags.length > 0)
							? floor.floorTags.split('、') : [];
					}
					if(this.floor == floor) {
						return
					}
					
					this.floor = floor
					this.setupShops(floor)
					this.layout()
					
					if(isReverse === true ) {
						if(index > -1 && index < this.start) {
							this.start = index
							this.floors = floors.slice(this.start, Math.min(this.start + this.pageSize, floors.length))
						}
					} else if(isReverse == false) {
						if(index < floors.length && index > this.start + this.pageSize - 1) {
							this.start = Math.max(0, index - this.pageSize  + 1)
							this.floors = floors.slice(this.start, index + 1)
						}
					} else if(this.start == -1 || this.floors.length == 0) {
						this.start = 0
						this.floors = floors.slice(this.start, Math.min(index + this.pageSize, floors.length))
					}
				}
			},
			
			handleShowLetters() {
				if(this._lettersVisible) {
					$(this.$refs.letters).slideUp()
					this._selectedLetter = null
					this.setupShops(this.floor)
					$('.active', this.$refs.letters).removeClass('active')
				} else {
					$(this.$refs.letters).slideDown()
				}
				this._lettersVisible = !this._lettersVisible
			},
			
			handleFilter(letter, index) {
				this._selectedLetter = letter
				this.setupShops(this.floor)
				
				$('.active', this.$refs.letters).removeClass('active')
				$($(this.$refs.letters).children()[index]).addClass('active')
			},
			
			// 安装店铺
			setupShops(floor) {
				this.pages.length = 0
				this.filterShops(floor, (shops) => {
					
					const _shops = this.querySearchShops(shops)
					const pages = [];
					const PAGE_SIZE = 15
					for(let i = 0, iLen = _shops.length; i < iLen; i += PAGE_SIZE) {
						const page = []
						for(let j = i, jLen = Math.min(iLen, i + PAGE_SIZE); j < jLen; j++) {
							page.push(_shops[j])
						}
						pages.push(page)
					}
					this.pages = pages
					this.setup()
				})
			},
			
			// 根据字母过滤
			querySearchShops(shops) {
				if(this._selectedLetter == null) {
					return shops
				}
				
				const result = []
				for(let i = 0, iCount = shops.length; i < iCount; i++) {
					if(shops[i].shopIndex == this._selectedLetter) {
						result.push(shops[i])
					}
				}
				const map = $(this.$refs.map)
				$('.ball', map).removeClass('ball')
				$('.location', map).remove()
				
				const parent = $('#' + this.swipeId)
				$('.active', parent).removeClass('active')
				
				return result
			},
			
			// 安装翻页
			setup() {
				let id = '#' + this.swipeId;
				this.$nextTick(() => {
					if(this.swiper) {
						this.swiper.reLoop()
					} else {
						this.swiper = new Swiper(id,{
						    pagination: '.pagination',
						    loop:false,
						    grabCursor: true,
						    paginationClickable: true,
						    slidesPerView: true
						})
					}
				})
			},
			
			// 地图布局
			layout() {
				if(!(this.floor && this.floor.floorId > 0 && this.canvas != null)) {
					return
				}
				this.canvas.clear()
				this.layoutBackground()
				this.layoutPois()
				
				const parent = $('#' + this.swiperId)
				$('.active', parent).removeClass('active')
				
				this.handleClickShop(this.$store.state.floor.shop)
			},
			
			layoutPois() {
				const map =$(this.$refs.map)
				const center = this.canvas.getCenter()
				const zoom = this.zoom || 1
				$('.poi, .location', map).remove()
				this.getPoisByFloorId(this.floor.floorId, pois => {
					pois.forEach(poi => {
						map.append(`<div class="poi" type="${ poi.poiType }" style="background-image: url(${ poi.poiIcon });
							left:${ poi.x / zoom + center.left - 15 }px;top: ${ poi.y / zoom + center.top - 30 }px"></div>`)
					}, this)
				})
			},
			
			layoutPoi(poi) {
				//const canvas = this.canvas
				//const center = this.canvas.getCenter()
				//const zoom = this.zoom || 1
				
				
				
//				fabric.Image.fromURL(poi.poiIcon, function(oImg) {
//					oImg.set({
//						poi: poi,
//						width: 30,
//						height: 30,
//						left: poi.x / zoom + center.left, top: poi.y / zoom + center.top,
//						selectable: false,
//						originY: 'bottom',
//					})
//					canvas.add(oImg)
//				});
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
				});
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
			
			// 楼梯联动
			handleLenged(types) {
				if(!Array.isArray(types)) {
					types = [types]
				}
				const map =$(this.$refs.map)
				$('.ball', map).removeClass('ball')
				$('.poi', map).each((i, div) => {
					if(types.includes(div.getAttribute('type'))) {
						$(div).animateCss('ball')
					}
				})
				
			},
			
			handleClickShop(shop) {
				if(!this.floor.rooms || !shop) {
					return
				}
				this.$store.state.floor.shop = shop
				const map =$(this.$refs.map)
				const center = this.canvas.getCenter()
				const zoom = this.zoom || 1
				$('.ball', map).removeClass('ball')
				$('.location', map).remove()
				
				const parent = $('#' + this.swipeId)
				$('.active', parent).removeClass('active')
				
				$('#' + 'floor_shop_' + shop.shopId).addClass('active')
				
				this.floor.rooms.forEach(r => {
					if(r.shopId == shop.shopId) {
						const s = $(`<a class="location"
						href="#/shop/0/${shop.shopId}"
						style="
							left:${ r.x / zoom + center.left - 25 }px;top: ${ r.y / zoom + center.top - 50 }px">
							<div class="shop-icon" style="background-image:url(${ shop.shopIconPath })"></div>
						</a>`).appendTo(map)
						setTimeout(() => {
							s.animateCss('ball')
						})
					}
				})
			},
			
		}
	})
})()
