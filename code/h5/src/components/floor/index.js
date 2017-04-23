(()=>{
	// 模版
	const template = `
		<div class="floor">
			<mixc-public-header title="楼层导购" sub-title="FLOOR NAVIGATION"></mixc-public-header>
			<div class="img" :style="{ backgroundImage: 'url(' + floor.navFilePath.substr(1) + ')' }"></div>
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
							<router-link class="shop-item" v-for="shop in shops"  :to="'/shop/0/' + shop.shopId">{{ shop.shopName }}</a>
						</div>
					</div>
					<div class="pagination" v-show="pages.length > 1"></div>
				</div>
			</div>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-floor', {
		template: template,
		data() {
			return {
				index: -1,
				start: -1,
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
				
				_lettersVisible: false,
				_selectedLetter: null,
				_selectedIndex: -1,
			}
		},
		created() {
			this.getFloors((rst)=> {
				this.allFloors = rst
				this.setupFloors(0)
			})
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
				this.setupFloors(this.index - 1);
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
			setupFloors (index, isReverse = true) {
				const floors = this.allFloors;
				if(this.index != index && index > -1 && index < floors.length) {
					this.index = index;
					let floor = floors[index];
					if(!floor.tags) {
						floor.tags = (floor.floorTags && floor.floorTags.length > 0)
							? floor.floorTags.split('、') : [];
					}
					this.floor = floor;
					this.setupShops(floor)
					if(!(this.start > -1 && index >= this.start && index < Math.min(this.start + this.pageSize, floors.length))) {
						if(isReverse) {
							this.floors = floors.slice(index, Math.min(index + this.pageSize, floors.length));
							this.start = index;
						} else {
							this.start = Math.max(0, index - this.pageSize);
							this.floors = floors.slice(this.start, index + 1);
						}
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
		}
	})
})()
