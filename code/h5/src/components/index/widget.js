(()=>{
	// 模版
	const template = `
		<div class="index-widget">
			<div class="row">
				<div class="col city">福州</div>
				<div class="col time">{{ date.hours }}:{{ date.minutes }}</div>
				<div class="col build align-right">名城中心</div>
			</div>
			<h5>{{ date.year }}.{{ date.month }}.{{ date.date }} 星期{{ date.week }}</h5>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-index-widget', {
		template: template,
		data() {
			return {
				date: {
					year: '2017',
					month: '01',
					date: '01',
					week: '一',
					hours: '00',
					minutes: '00'
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
