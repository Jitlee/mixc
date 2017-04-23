(()=>{
	// 模版
	const template = `
		<div class="config">
			<a class="button" @click.navtive="handleOpen"></a>
			<mixc-password v-show="passwordVisible" @close="passwordVisible = false" @setting="settingVisible = true"></mixc-password>
			<mixc-setting v-show="settingVisible" @close="settingVisible = false"></mixc-setting>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-config', {
		template: template,
		data() {
			return {
				passwordVisible: false,
				settingVisible: false,
				
				doubleClick: {
					interval: 500, // 500毫秒模拟双击
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
						this.passwordVisible = true
						
						this.$store.state.config = PROXY.getConfig()
					}
				}
			}
		}
	})
})()


