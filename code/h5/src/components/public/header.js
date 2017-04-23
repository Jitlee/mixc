(()=>{
	// 模版
	const template = `
		<header class="public-header">
			<div class="block1"></div>
			<div class="block2"></div>
			<div class="block3"></div>
			<div class="block4"></div>
			<div class="block5"></div>
			<div class="block6 align-right">
				{{ date.year }}.{{ date.month }}.{{ date.date }} 星期{{ date.week }}
			</div>
			<router-link to="/" class="block7 align-center">
				<i class="iconfont icon-home"></i>
				<div class="title">返回首页</div>
			</router-link>
			<div class="block8">
				<h2>{{ subTitle }}</h2>
				<h1>{{ title }}</h1>
			</div>
			<ul class="block9">
				  <li><i class="iconfont icon-tshirt"></i></li>
				  <li><i class="iconfont icon-qunzi"></i></li>
				  <li><i class="iconfont icon-underwear"></i></li>
				  <li><i class="iconfont icon-kuzi"></i></li>
				  <li><i class="iconfont icon-baobao"></i></li>
				  <li><i class="iconfont icon-kouhong"></i></li>
				  <li><i class="iconfont icon-shoubiao"></i></li>
				  <li><i class="iconfont icon-yanjing"></i></li>
			</ul>
		</header>
	`
	
	// 注册组件
	Vue.component('mixc-public-header', {
		template: template,
		props:{
			title: String,
			subTitle: String,
		},
		data() {
			return {
				date: {
					year: '2017',
					month: '01',
					date: '01',
					week: '一',
					hours: '00',
					minutes: '00',
				}
			}
		},
		created() {
			this.formatTimer()
			this.beginTimer()
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
				this.date = formatDate()
			}
		}
	})
})()
