(()=>{
	
	const LETTERS = ["123"].concat(Array.apply(null, {length:26}).map((e, i) => { return String.fromCharCode(65 + i) }))
	const DIGITS = ["ABC"].concat(Array.apply(null, {length:10}).map((e, i) => { return (i + 1) % 10 }))
	
	// 模版
	const template = `
		<div class="brand" ref="brand">
			<mixc-public-header title="品牌导购" sub-title="BRAND SHOPPING GUIDE"></mixc-public-header>
			<div class="side">
				<div class="top">
					<hr />
					<a :class="{ active: tab == 0 }" @click="handleTab(0)">品牌查找</a>
					<a :class="{ active: tab == 1 || tab == 2 }" @click="handleTab(1)">字母查找</a>
					<a :class="{ active: tab == 3 }" @click="handleTab(3)">楼层查找</a>
					<div class="title">{{ navTitle }}</div>
				</div>
				<transition-group name="menuList" tag="div" class="menus clear" ref="list" :class="{ letter: tab == 1 || tab == 2 }">
					<a v-for="(item, index) in menus" @click="handleMenu($event, index)" :key="item" :class="{ active: filterIndex == index }">{{ item }}</a>
				</transition-group>
			</div>
			<div class="submenus" ref="submenus" style="display: none;">
				<a  @click="handleSubMenu($event, -1)" :class="{ active: subFilterIndex == -1 }">全部</a>
				<a v-for="(item, index) in submenus" @click="handleSubMenu($event, index)" :class="{ active: subFilterIndex == index }">{{ item.dictValue }}</a>
			</div>
			<div class="content">
				<mixc-brand-table :source="shops"></mixc-brand-table>
			</div>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-brand', {
		template: template,
		data() {
			const typeId = this.$route.params.typeId || 0
			return {
				tab: this.$store.state.brand.tab,
				
				typeId: typeId,
				
				filterIndex: this.$store.state.brand.filterIndex, // 大分类，字母，数字，选中的id
				subFilterIndex: this.$store.state.brand.subFilterIndex, // 小分类选中的id
				
				shops: [],
				
				menus: [],
				
				tempMenus: [],
				tempIndex: 0,
				tempTimeoutId: 0,
				
				submenus: [],
				
				navTitle: '品类查找'
			}
		},
		created() {
			// this.setupShopes()
			this.setTabIndex(this.tab)
		},
		
		mounted() {	
			const submenus = this.$refs.submenus
			$(this.$refs.brand).click(function(evt) {
				const target = $(evt.target)
				
				if(target.closest(submenus).length == 0) {
					$(submenus).hide();
				}
			})
		},
		
		methods: {
			setTempMenus(menus) {
				clearTimeout(this.tempTimeoutId)
				this.tempMenus = menus
				this.tempIndex = 0
				this.menus.length = 0
				this.beginTransition()
			},
			beginTransition() {
				const length = this.tempMenus.length
				if(this.tempIndex < length) {
					this.menus.push(this.tempMenus[this.tempIndex])
					this.tempIndex++
					if(this.tempIndex < length) {
						this.tempTimeoutId = setTimeout(this.beginTransition.bind(this), this.tab== 1 || this.tab == 2 ? 50 : 150)
					} else {
					}
				}	
			},
			
			handleTab(tab) {
				if(tab == this.tab) {
					return
				}
				this.shops = []
				
				this.filterIndex = -1
				this.subFilterIndex = -1
				this.$store.state.brand.filterIndex = -1
				this.$store.state.brand.subFilterIndex = -1
				
				this.$store.state.brand.tab = tab
				this.setTabIndex(tab)
			},
			
			setTabIndex(tab) {
				this.tab = tab
				this.navTitle = ['品类查找', '字母查找', '数字查找', '楼层查找'][tab]
				switch(tab) {
					case 0:
						this.setupMajorShopTypes()
						break
					case 1:
						this.setupLetters()
						break
					case 2:
						this.setupDigits()
						break
					case 3:
						this.setupFloors()
						break
					default:
						break
				}
				this.setupShopes()
			},
			
			handleMenu(evt, index) {
				const tab = this.tab
				switch(tab) {
					case 0:
						this.filterMajorShopTypes(evt, index)
						break
					case 1:
						this.filterLetters(index)
						break
					case 2:
						this.filterDigits(index)
						break
					case 3:
						this.filterFloors(index)
						break
					default:
						break
				}
			},
			
			handleSubMenu(evt, index) {
				evt && evt.stopPropagation()
				$(this.$refs.submenus).hide();
				if(index == this.subFilterIndex) {
					return
				}
				
				this.shops = []
				this.filterMinorShopTypes(index)
			},
			
			setupShopes() {
				if(this.tab > -1 && this.subFilterIndex > -1) {
					this.filterMinorShopTypes(this.subFilterIndex)
				} else if(this.filterIndex > -1) {
					this.handleMenu(null, this.filterIndex)
				} else {
					this.getShops(shops => {
						this.shops = shops
					})
				}
			},
			setupMajorShopTypes() {
				this.getShopTypes(shopTypes => {
					this.setTempMenus(shopTypes.map((e) => { return e.dictValue }))
					
					var index = this.$store.state.brand.filterIndex
					
					if(this.typeId > 0) {
						for(let i = 0, len = shopTypes.length; i < len; i++) {
							if(shopTypes[i].dictId == this.typeId) {
								index = i
								break
							}
						}
					}
					
					this.typeId = 0
					
					if(index == -1) {
						return
					}
			
					this.filterIndex = index
					this.$store.state.brand.filterIndex = index
					
					this.filterShopesByMajorType(index, shops => {
						this.shops = shops
					})
				})
			},
			
			// 切换到楼层
			setupFloors() {
				this.getFloors(floors => {
					this.setTempMenus(floors.map((e) => { return e.floorName }))
				})
			},
			
			// 切换到字母
			setupLetters() {
				this.setTempMenus(LETTERS)
			},
			
			// 切换到数字
			setupDigits() {
				this.setTempMenus(DIGITS)
			},
			
			// 一级分类
			filterMajorShopTypes(evt, index) {
				evt && evt.stopPropagation()
				
				if(this.filterIndex == index) {
					const subObj = $(this.$refs.submenus)
					if(subObj.is(':visible')) {
						subObj.hide()
						return
					}
				}
				
				this.shops = []
				this.filterIndex = index
				this.$store.state.brand.filterIndex = index
				this.$store.state.brand.subFilterIndex = -1
				this.subFilterIndex = -1
				
				if(index == -1) {
					return
				}
				
				this.filterShopesByMajorType(index, shops => {
					this.shops = shops
				})
				
				if(!evt) {
					return
				}
				this.getShopTypes(shopTypes => {
					this.submenus = shopTypes[index].children
					
					const menu = $(evt.target)
					const submenus = $(this.$refs.submenus).show()
					const menuTop = menu.offset().top
					const subHeight = submenus.height()
					const screenHeight = $(window).height()
					submenus.css("top", Math.min(screenHeight - subHeight, menuTop) - 10 + "px").animateCss('zoomIn')
				})
			},
			
			// 二级分类
			filterMinorShopTypes(index) {
				this.subFilterIndex = index
				this.$store.state.brand.subFilterIndex = index
				if(index == -1) {
					this.filterShopesByMajorType(this.filterIndex, shops => {
						this.shops = shops
					})
				} else {
					this.filterShopesByMinorType(this.filterIndex, index, shops => {
						this.shops = shops
					})
				}
			},
			
			// 根据字母过滤
			filterLetters(index) {
				if(index == 0) {
					this.handleTab(2)
					return
				}
				this.shops = []
				this.filterIndexes(index)
			},
			
			// 根据数组过滤
			filterDigits(index) {
				if(index == 0) {
					this.handleTab(1)
					return
				}
				this.shops = []
				this.filterIndexes(index)
			},
			
			// 根据索引过滤
			filterIndexes(index) {
				this.filterIndex = index
				this.$store.state.brand.filterIndex = index
				const shopIndex = String(this.tempMenus[index])
				this.filterShopesByIndex(shopIndex, (shops) => {
					this.shops = shops
				})
			},
			
			// 根据楼层过滤
			filterFloors(index) {
				this.filterIndex = index
				this.$store.state.brand.filterIndex = index
				this.shops = []
				this.getFloors(floors => {
					const floor = floors[index]
					this.filterShopesByFloor(floor, (shops) => {
						this.shops = shops
					})
				})
			},
			
			// 根据索引过滤
			filterShopesByIndex(shopIndex, callback) {
				this.getShops(shops => {
					const shopIds = new Set()
					const result = []
					shops.forEach(s => {
						if(!shopIds.has(s.shopId) && s.shopIndex == shopIndex) {
							result.push(s)
						}
					})
					shopIds.clear()
					if(result.length > 0) {
						callback(result)
					}
				})
			},
			
			// 根据楼层过滤
			filterShopesByFloor(floor, callback) {
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
			
			// 根据一级分类过滤
			filterShopesByMajorType(typeIndex, callback) {
				this.getShops(shops => {
					const shopLength = shops.length
					this.getShopTypes(shopTypes => {
						const shopType = shopTypes[typeIndex]
						const result = []
						for(var j = 0; j < shopLength; j++) {
							for(let i = 0, len = shopType.children.length; i < len; i++) {
								const mShopType = shopType.children[i].dictId
								const shop = shops[j]
								if(shop.shopType == mShopType) {
									result.push(shop)
								}
							}
						}
						callback(result)
					})
				})
			},
			
			// 根据二级分类过滤
			filterShopesByMinorType(majorIndex, minorIndex, callback) {
				this.getShops(shops => {
					const shopLength = shops.length
					this.getShopTypes(shopTypes => {
						const shopType = shopTypes[majorIndex]
						const mShopType = shopType.children[minorIndex].dictId
						const result = []
						for(var j = 0; j < shopLength; j++) {
							const shop = shops[j]
							if(shop.shopType == mShopType) {
								result.push(shop)
							}
						}
						callback(result)
					})
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
			
			// 获取分类
			getShopTypes(callback) {
				if(this.$store.state.shopTypes.length > 0) {
					callback(this.$store.state.shopTypes)
				} else {
					PROXY.getJSON('data/shopType.json', (rst) => {
						if(rst && rst.length > 0) {
							this.$store.state.shopTypes = rst
							callback(rst)
						}
					})
				}
			},
		}
	})
})()
