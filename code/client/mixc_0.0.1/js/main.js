(function(){
	
	const cv = !window.require ? null : require('./js/checkversion.js')
	const _configListeners = []
	
	const WEEKS = '日一二三四五六';
	const LETTERS = ["123"].concat(Array.apply(null, {length:26}).map((e, i) => { return String.fromCharCode(65 + i) }));
	const DIGITS = ["ABC"].concat(Array.apply(null, {length:10}).map((e, i) => { return (i + 1) % 10 }));
			
	// 获取数据
	let context = {
		shops: null,
		shopMap: {},
		floors: null,
		floorMap: {},
		shopTypes: null,
		activities: null,
		ads: null,
		albums: null,
	};
	
	function handleAdsNav(row) {
		const adsTargetType = Number(row.adsTargetType);
		const adsTargetId = Number(row.adsTargetId);
		var path = null;
		switch(adsTargetType) {
			case -1:
				if(adsTargetId > 0) {
					path = '/shop/1/' + adsTargetId;
				} else {
					path = '/shop/1/0'
				}
				break;
			case -2:
				if(adsTargetId > 0) {
					path = '/brand/' + adsTargetId;
				} else {
					path = '/brand/0'
				}
				break;
			case -3:
				if(adsTargetId > 0) {
					path = '/article/' + adsTargetId;
				}
				break;
			case -4:
				if(adsTargetId > 0) {
					path = '/activity/' + adsTargetId;
				} else {
					path = '/activity/0'
				}
				break;
			case -5:
				path = '/info';
				break;
			case -6:
				path = '/floor';
				break;
			default:
				break;
		}
		if(path) {
			this.$router.replace(path);
		}
	}
	
	function getShops(callback) {
		var ths = this;
		if(context.shops != null) {
			callback.call(ths, context.shops, context.shopMap);
		} else {
			$.getJSON('data/shop.json', null, (shops) => {
				if(shops && shops.length > 0) {
					context.shops = shops;
					for(let i = 0, len = shops.length; i < len; i++) {
						context.shopMap[shops[i].shopId] = shops[i];
					}
					callback.call(ths, context.shops, context.shopMap);
				}
			});
		}
	}
	
	function getShopTypes(callback) {
		var ths = this;
		if(context.shopTypes != null) {
			callback.call(ths, context.shopTypes);
		} else {
			$.getJSON('data/shopType.json', null, (shopTypes) => {
				if(shopTypes && shopTypes.length > 0) {
					context.shopTypes = shopTypes;
					callback.call(ths, shopTypes);
				}
			});
		}
	}
	
	function getFloors(callback) {
		var ths = this;
		if(context.floors != null) {
			callback.call(ths, context.floors, context.floorMap);
		} else {
			$.getJSON('data/floor.json', null, (floors) => {
				if(floors && floors.length > 0) {
					context.floors = floors;
					for(let i = 0, len = floors.length; i < len; i++) {
						context.floorMap[floors[i].floorId] = floors[i];
					}
					callback.call(ths, context.floors, context.floorMap);
				}
			});
		}
	}
	
	function filterShopesByFloor(floor, callback) {
		if(!floor) {
			return;
		}
		
		if(floor.shops) {
			callback.call(this, floor.shops);
		} else {
			const rooms = floor.rooms;
			getShops.call(this, (arg1, shopsMap) => {
				let shops = [];
				let shopIds = [];
				for(let i = 0, len = rooms.length; i < len; i++) {
					const shop = shopsMap[rooms[i].shopId];
					if(shop && !shopIds.includes(shops.shopId)) {
						shops.push(shop);
					}
				}
				floor.shops = shops;
				callback.call(this, shops);
			})
		}
	}
	
	function filterShopesByIndex(index, callback) {
		getShops.call(this, (shops, shopsMap) => {
			let result = [];
			for(let i = 0, len = shops.length; i < len; i++) {
				const shop = shops[i];
				if(shop.shopIndex == index) {
					result.push(shop);
				}
			}
			callback.call(this, result);
		});
	}
	
	function filterShopesByMajorType(typeIndex, callback) {
		getShops.call(this, (shops) => {
			const shopLength = shops.length;
			getShopTypes.call(this, (shopTypes) => {
				const shopType = shopTypes[typeIndex];
				let result = [];
				for(var j = 0; j < shopLength; j++) {
					for(let i = 0, len = shopType.children.length; i < len; i++) {
						const mShopType = shopType.children[i].dictId;
						const shop = shops[j];
						if(shop.shopType == mShopType) {
							result.push(shop);
						}
					}
				}
				callback.call(this, result);
			});
		});
	}
	
	function filterShopesByMinorType(majorIndex, minorIndex, callback) {
		getShops.call(this, (shops) => {
			const shopLength = shops.length;
			getShopTypes.call(this, (shopTypes) => {
				const shopType = shopTypes[majorIndex];
				const mShopType = shopType.children[minorIndex].dictId;
				let result = [];
				for(var j = 0; j < shopLength; j++) {
					const shop = shops[j];
					if(shop.shopType == mShopType) {
						result.push(shop);
					}
				}
				callback.call(this, result);
			});
		});
	}
	
	function getActivities(callback) {
		var ths = this;
		if(context.activities != null) {
			callback.call(ths, context.activities);
		} else {
			$.getJSON('data/activity.json', null, (activities) => {
				if(activities && activities.length > 0) {
					context.activities = activities;
					callback.call(ths, context.activities);
				}
			});
		}
	}
	
	function getAds(callback) {
		var ths = this;
		if(context.ads != null) {
			callback.call(ths, context.ads);
		} else {
			$.getJSON('data/ads.json', null, (ads) => {
				if(ads && ads.length > 0) {
					context.ads = ads;
					callback.call(ths, context.ads);
				}
			});
		}
	}
	
	function getAdsByGroup(group, callback) {
		getAds.call(this, function(ads) {
			let result = [];
			for(let i = 0, len = ads.length; i < len; i++) {
				if(ads[i].adsGroupId == group) {
					result.push(ads[i]);
				}
			}
			callback.call(this, result);
		});
	}
	
	function getArticles(callback) {
		var ths = this;
		if(context.articles != null) {
			callback.call(ths, context.articles);
		} else {
			$.getJSON('data/article.json', null, (articles) => {
				if(articles && articles.length > 0) {
					context.articles = articles;
					callback.call(ths, context.articles);
				}
			});
		}
	}
	
	function getArticlesByGroup(group, callback) {
		getArticles.call(this, function(articles) {
			let result = [];
			for(let i = 0, len = articles.length; i < len; i++) {
				if(articles[i].articleGroupId == group) {
					result.push(articles[i]);
				}
			}
			callback.call(this, result);
		});
	}
	
	function getAlbums(callback) {
		var ths = this;
		if(context.albums != null) {
			callback.call(ths, context.albums);
		} else {
			$.getJSON('data/album.json', null, (albums) => {
				if(albums && albums.length > 0) {
					context.albums = albums;
					callback.call(ths, context.albums);
				}
			});
		}
	}
	
	function getAlbumByType(albumType, objId, callback) {
		getAlbums.call(this, function(albums) {
			let result = [];
			for(let i = 0, len = albums.length; i < len; i++) {
				if(albums[i].albumType == albumType && albums[i].objId == objId) {
					result.push(albums[i]);
				}
			}
			callback.call(this, result);
		});
	}
	
	// 注册组件
	Vue.component('mixc-article', {
		template: '#article-template',
		data() {
			var articleId = this.$route.params.articleId || 0;
			return {
				articleId: articleId,
				data: { articleId: 0, articleTitle: '', articleContent: '' },
			}
		},
		created() {
			getArticles.call(this, (articles) => {
				const articleId = this.articleId;
				for(let i = 0, len = articles.length; i < len; i++) {
					if(articles[i].articleId == articleId) {
						this.data = articles[i];
						break;
					}
				}
			})
		}
	});
	
	Vue.component('mixc-info', {
		template: '#info-template',
		data() {
			return {
				currentArticle: { articleId: 0, articleTitle: '', articleContent: '' },
				list: []
			}
		},
		created() {
			getArticlesByGroup.call(this, 53, (articles) => {
				this.list = articles;
				if(articles.length > 0) {
					this.currentArticle = articles[0];
				}
			})
		}, 
		methods: {
			handleClick(index) {
				this.currentArticle = this.list[index];
			}
		}
	});
	
	Vue.component('mixc-activity', {
		template: '#activity-template',
		data() {
			const activityId = this.$route.params.activityId || 0;
			return {
				activityId: activityId,
				currentActivity: { activityFilePath: "" },
				activities: []
			}
		},
		created() {
			getActivities.call(this, (activities) => {
				this.activities = activities;
				if(activities.length > 0) {
					this.currentActivity = activities[0];
					
					if(!(this.activityId > 0)) {
						return;
					}
					
					const activityId = this.activityId;
					
					for(let i = 0, len = activities.length; i < len; i++) {
						if(activities[i].activityId == activityId) {
							this.handleSelect(i);
							break;
						}
					}
				}
			})
		}, 
		methods: {
			handleSelect(index) {
				this.currentActivity = this.activities[index];
			}
		}
	});
	
	
	Vue.component('mixc-floor', {
		template: '#floor-template',
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
				swiper: null,
				swipeId: 'swipe' + new Date().getTime(),
			}
		},
		created() {
			getFloors.call(this, (floors) => {
				this.allFloors = floors;
				this.setupFloors(0);
			})
		},
		methods: {
			handlePrev () {
				this.setupFloors(this.index - 1);
			},
			handleNext () {
				this.setupFloors(this.index + 1, false);
			},
			handleClick(index) {
				this.setupFloors(index + this.start);
			},
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
					this.setupShops(floor);
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
			setupShops(floor) {
				filterShopesByFloor.call(this, floor, (shops) => {
					const pages = [];
					const PAGE_SIZE = 15
					const set = new Set()
					const _shops = []
					shops.forEach(s => { if(!set.has(s.shopId)) {
						_shops.push(s)  }
						set.add(s.shopId)
					})
					set.clear()
					const len = _shops.length
					for(let i = 0; i < len; i += PAGE_SIZE) {
						const page = []
						for(let j = i; j < i + PAGE_SIZE && j < len; j++) {
							page.push(_shops[j])
						}
						pages.push(page)
					}
					this.pages = pages;
					this.setup()
				})
			},
			
			setup() {
				let id = '#' + this.swipeId;
				const ths = this
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
				});
			},
		}
	});
	
	Vue.component('mixc-shop', {
		template: '#shop-template',
		data() {
			const shopId = this.$route.params.shopId
			return {
				shopId: shopId,
				garryId: 'shopAbums' + shopId,
				shop: {
					shopName: '',
					shopFloor: '',
					shopRoom: '',
					shopDesc: '',
					shopIconPath: '',
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
			getShops.call(this, (shops, shopMap) => {
				const shop = shopMap[this.shopId];
				if(shop) {
					this.shop = shop
					if(this.shopAlbum == '') {
						this.shopAlbum = this.shop.shopImagePath
					}
				}
			})
			
			getAlbumByType.call(this, 'shop', this.shopId, (albums) => {
				if(albums.length > 0) {
					this.shopAlbum = albums[0].filePath
					this.shopAlbums = albums
				} else if(this.shop.shopImagePath != '') {
					this.shopAlbum = this.shop.shopImagePath
				}
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
				    pagination: '.pagination',
				    loop:true,
				    grabCursor: true,
				    paginationClickable: true,
				    onTap: this.handleClose.bind(this)
				})
			},
			handleShow() {
				$('#' + this.garryId).fadeIn()
				this.setup()
			},
			handleClose() {
				$('#' + this.garryId).fadeOut()
			},
		}
	});
	
	Vue.component('mixc-brand-table', {
		template: '#brand-table-template',
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
	});
	
	Vue.component('mixc-brand', {
		template: '#brand-template',
		data() {
			const typeId = this.$route.params.typeId || 0;
			return {
				tab: -1,
				
				typeId: typeId,
				
				filterIndex: -1, // 大分类，字母，数字，选中的id
				subFilterIndex: -1, // 小分类选中的id
				
				shops: [],
				
				menus: [],
				
				submenus: [],
			}
		},
		created() {
			this.setupShopes();
			this.handleTab(0);
		},
		
		mounted() {	
			const submenus = this.$refs.submenus;
			$(this.$refs.brand).click(function(evt) {
				const target = $(evt.target);
				
				if(target.closest(submenus).length == 0) {
					$(submenus).hide();
				}
			});
		},
		
		methods: {
			handleTab(tab) {
				if(tab == this.tab) {
					return;
				}
				
				this.tab = tab;
				this.filterIndex = -1;
				this.subFilterIndex = -1;
				this.setupShopes();
				switch(tab) {
					case 0:
						this.setupMajorShopTypes();
						break;
					case 1:
						this.setupLetters();
						break;
					case 2:
						this.setupDigits();
						break;
					case 3:
						this.setupFloors();
						break;
					default:
						break;
				}
			},
			
			handleMenu(evt, index) {
				const tab = this.tab;
				switch(tab) {
					case 0:
						this.filterMajorShopTypes(evt, index);
						break;
					case 1:
						this.filterLetters(index);
						break;
					case 2:
						this.filterDigits(index);
						break;
					case 3:
						this.filterFloors(index);
						break;
					default:
						break;
				}
			},
			
			handleSubMenu(evt, index) {
				evt.stopPropagation();
				$(this.$refs.submenus).hide();
				if(index == this.subFilterIndex) {
					return;
				}
				
				this.filterMinorShopTypes(index);
			},
			
			setupShopes() {
				getShops.call(this, (shops) => {
					if(this.shops.length != shops.length) {
						this.shops = shops.slice();
					}
				});
			},
			setupMajorShopTypes() {
				getShopTypes.call(this, (shopTypes) => {
					this.menus = shopTypes.map((e) => { return e.dictValue });
					
					if(!(this.typeId >= 0)) {
						return;
					}
					var index = -1;
					for(let i = 0, len = shopTypes.length; i < len; i++) {
						if(shopTypes[i].dictId == this.typeId) {
							index = i;
							break;
						}
					}
					
					this.typeId = 0;
					
					if(index == -1) {
						return;
					}
			
					this.filterIndex = index;
					
					filterShopesByMajorType.call(this, index, (shops) => {
						this.shops = shops;
					});
				});
			},
			
			setupFloors() {
				getFloors.call(this, (floors) => {
					this.menus = floors.map((e) => { return e.floorName });
				});
			},
			setupLetters() {
				this.menus = LETTERS;
			},
			setupDigits() {
				this.menus = DIGITS;
			},
			
			filterMajorShopTypes(evt, index) {
				evt.stopPropagation();
				
				if(this.filterIndex == index) {
					$(this.$refs.submenus).show();
					return;
				}
				
				this.filterIndex = index;
				this.subFilterIndex = -1;
				
				filterShopesByMajorType.call(this, index, (shops) => {
					this.shops = shops;
				});
				
				getShopTypes.call(this, (shopTypes) => {
					this.submenus = shopTypes[index].children;
					
					const menu = $(evt.target);
					const submenus = $(this.$refs.submenus).show();
					const menuTop = menu.offset().top;
					const subHeight = submenus.height();
					const screenHeight = $(window).height();
					submenus.css("top", Math.min(screenHeight - subHeight, menuTop) - 10 + "px");
				});
			},
			filterMinorShopTypes(index) {
				this.subFilterIndex = index;
				if(index == -1) {
					filterShopesByMajorType.call(this, this.filterIndex, (shops) => {
						this.shops = shops;
					});
				} else {
					filterShopesByMinorType.call(this, this.filterIndex, index, (shops) => {
						this.shops = shops;
					});
				}
			},
			filterLetters(index) {
				if(index == 0) {
					this.handleTab(2);
					return;
				}
				this.filterIndexes(index);
			},
			filterDigits(index) {
				if(index == 0) {
					this.handleTab(1);
					return;
				}
				this.filterIndexes(index);
			},
			filterIndexes(index) {
				this.filterIndex = index;
				const shopIndex = String(this.menus[index]);
				filterShopesByIndex.call(this, shopIndex, (shops) => {
					this.shops = shops;
				});
			},
			filterFloors(index) {
				this.filterIndex = index;
				getFloors.call(this, (floors) => {
					const floor = floors[index];
					filterShopesByFloor.call(this, floor, (shops) => {
						this.shops = shops;
					});
				});
			}
		}
	});
	
	Vue.component('mixc-top-header', {
		template: '#top-header-template',
		props:{
			title: String,
			subTitle: String
		},
		methods: {
		}
	});
	
	Vue.component('mixc-top-timer', {
		template: '#top-timer-template',
		data() {
			return {
				year: '2017',
				month: '01',
				date: '01',
				week: '一',
				hour: '00',
				minutes: '00'
			}
		},
		created() {
			this.formatTimer()
		},
		methods: {
			beginTimer() {
				const now = new Date()
				if(now.getSeconds() == 0) {
					setInterval(this.formatTimer.bind(this), 6*1000)
				} else {
					setTimeout(this.beginTimer.bind(this), (60 - now.getSeconds()) * 1000)
				}
			},
			formatTimer() {
				const now = new Date()
				const month = now.getMonth() + 1
				const date = now.getDate()
				const hour = now.getHours()
				const minutes = now.getMinutes()
				this.year = now.getFullYear()
				this.month = month > 9 ? month : ('0' + month)
				this.date = date > 9 ? date : ('0' + date)
				this.week = WEEKS[now.getDay()]
				this.hour = hour > 9 ? hour : ('0' + hour)
				this.minutes = minutes > 9 ? minutes : ('0' + minutes)
			}
		}
	});
	
	Vue.component('mixc-home-category', {
		template: '#home-category-template',
		data() {
			return {
				list: [],
			}
		},
		created() {
			this.loadData();
		},
		methods: {
			loadData() {
				getAdsByGroup.call(this, 47, function(ads) {
					this.list = ads;
				});
			},
			handleClick(index, row) {
				handleAdsNav.call(this, row);
			},
		}
	});
	
	Vue.component('mixc-home-widget', {
		template: '#home-widget-template',
		data() {
			return {
				year: '2017',
				month: '01',
				date: '01',
				week: '一',
				hour: '00',
				minutes: '00'
			}
		},
		created() {
			this.formatTimer()
		},
		methods: {
			beginTimer() {
				const now = new Date()
				if(now.getSeconds() == 0) {
					setInterval(this.formatTimer.bind(this), 6*1000)
				} else {
					setTimeout(this.beginTimer.bind(this), (60 - now.getSeconds()) * 1000)
				}
			},
			formatTimer() {
				const now = new Date()
				const month = now.getMonth() + 1
				const date = now.getDate()
				const hour = now.getHours()
				const minutes = now.getMinutes()
				this.year = now.getFullYear()
				this.month = month > 9 ? month : ('0' + month)
				this.date = date > 9 ? date : ('0' + date)
				this.week = WEEKS[now.getDay()]
				this.hour = hour > 9 ? hour : ('0' + hour)
				this.minutes = minutes > 9 ? minutes : ('0' + minutes)
			}
		}
	});
	
	Vue.component('mixc-home-nav', {
		template: '#home-nav-template',
		data() {
			return {
				list: [],		
			}
		},
		created() {
			this.loadData();
		},
		methods: {
			loadData() {
				getAdsByGroup.call(this, 54, function(ads) {
					this.list = ads;
				});
			},
			handleClick(index, row) {
				handleAdsNav.call(this, row);
			},
		}
	});

	Vue.component('mixc-ads', {
		template: '#ads-template',
		data() {
			return {
				list: [],
				swiper: null,
				swipeId: 'swipe' + new Date().getTime()
			}
		},
		created() {
			this.loadData();
		},
		mounted() {
		},
		methods: {
			loadData() {
				getAdsByGroup.call(this, 44, function(ads) {
					this.list = ads;
					this.setup();
				});
			},
			setup() {
				let id = '#' + this.swipeId
				this.$nextTick(() => {
					this.swiper = new Swiper(id,{
					    pagination: '.pagination',
					    loop:true,
					    grabCursor: true,
//					    paginationClickable: true,
					    autoplay : 5000,
						speed: 500,
					    onTap: this.handleClick.bind(this),
					})
				});
			},
			handleClick() {
				const index = this.swiper.activeIndex - 1
				const ads = this.list[index]
				if(ads) {
					handleAdsNav.call(this, ads);
				}
			},
		}
	});

	Vue.component('mixc-home', {
		template: '#home-template'
	});
	
	Vue.component('mixc-modal', {
		template: '#modal-template',
	});
	
	Vue.component('mixc-password', {
		template: '#password-template',
		data() {
			return {
				nums: [],
				index: 0,
				password: '0000',
				title: '请输出密码'
			}
		},
		created() {
			_configListeners.push(this.onconfig.bind(this))
		},
		methods: {
			handleKeyUp(key) {
				if(key == -1) {
					if(this.index == 0) {
						this.$emit('close')
					} else {
						this.index--
						this.nums.pop()
					}
				} else {
					this.index++
					this.nums.push(key)
					if(this.index == 4) {
						if(this.password == this.nums.join('')) {
							this.$emit('close')
							console.info('密码正确')
							
							this.index = 0
							this.nums = []
							this.title = '请输出密码'
							
							layer.open({
			    				content: '您确定要退出应用程序吗？',
			    				btn: ['是的', '不，去设置页面'],
			    				shadeClose: true, //开启遮罩关闭
			    				yes: function(index){
									if(window.require) {
										const { app } = require('electron').remote
										app.quit()
									}
			      					layer.close(index)
								},
								no: this.onsetting.bind(this),
			  				})
						} else {
							this.index = 0
							this.nums = []
							this.title = '再试一次'
							$(this.$refs.input).animateCss('shake')
						}
					}
				}
			},
			onsetting() {
				console.log('打开设置页面');
				this.$emit('setting')
			},
			onconfig(config) {
				if(config && config.password && config.password.length == 4) {
					this.password = config.password
				}
			},
		}
	});
	
	Vue.component('mixc-config', {
		template: '#config-template',
		data() {
			return {
				passwordVisible: false,
				settingVisible: false,
				
				doubleClick: {
					interval: 200, // 200毫秒模拟双击
					lastTime: 0, // 上次点击的时间
				}
			}
		},
		methods: {
			handleOpen() {
				const time = new Date().getTime()
				const lastTime = this.doubleClick.lastTime
				this.doubleClick.lastTime = time
				if(time - lastTime < this.doubleClick.interval) {
					// 双击成功
					if(!this.passwordVisible) {
						
						if(cv) {
							const config = $.extend({ server: 'cky.ritacc.net', port: '8888', sourceId: '1' }, cv.readConfig());
							_configListeners.forEach(fun => fun(config))
						}
						
						this.passwordVisible = true
					}
				}
			}
		}
	});
	
	Vue.component('mixc-setting', {
		template: '#setting-template',
		data() {
			return {
				formData: {},
			}
		},
		created() {
			_configListeners.push(this.onconfig.bind(this))
		},
		methods: {
			handleSubmit() {
				this.$emit('close')
				cv && cv.saveConfig(this.formData)
			},
			onconfig(config) {
				this.formData = config
			}
		}
	});
	
	var router = new VueRouter({
		routes: [
			{ path: '/', component: {  template: '<mixc-home></mixc-home>' } },
			{ path: '/brand/:typeId', component: {  template: '<mixc-brand></mixc-brand>' } },
			{ path: '/shop/:type/:shopId', component: {  template: '<mixc-shop></mixc-shop>' } },
			{ path: '/floor', component: {  template: '<mixc-floor></mixc-floor>' } },
			{ path: '/activity/:activityId', component: {  template: '<mixc-activity></mixc-activity>' } },
			{ path: '/info', component: {  template: '<mixc-info></mixc-info>' } },
			{ path: '/article/:articleId', component: {  template: '<mixc-article></mixc-article>' } },
		]
	});
	
	// 启动APP
	new Vue({ router }).$mount('#app');
	
	// -----------------------------
	// 代码
	
	// 自动播放广告时回到主页
	window.__backHome = function(){
		router.replace('/')
		console.log('播放广告了')
	}
	
	$.fn.extend({
    	animateCss: function (animationName) {
	    	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	    	this.addClass('animated ' + animationName).one(animationEnd, function() {
	    		$(this).removeClass('animated ' + animationName);
	    	});
	    }
	});
	
	
})();
