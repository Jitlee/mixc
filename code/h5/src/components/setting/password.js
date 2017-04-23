(()=>{
	// 模版
	const template = `
		<mixc-public-modal @close="$emit('close')" class="password">
		    <h3 slot="header">{{ title }}</h3>
		    <h3 slot="body">
		    		<ul ref="input" class="input">
		    			<li class="num" v-for="n in 4" :class="{ active: n <= index }"></li>
		    		</ul>
		    		<ul class="keyboard">
		    			<li class="key" v-for="n in 9" @click="handleKeyUp(n)">{{n}}</li>
		    			<li class="key" @click="handleKeyUp(0)">0</li>
		    			<li class="key key-back" @click="handleKeyUp(-1)">{{ index == 0 ? '取消' : '删除' }}</li>
		    		</li>
		    </h3>
		    <span slot="footer">
		    </span>
	  	</mixc-public-modal>
	`
	
	// 注册组件
	Vue.component('mixc-password', {
		template: template,
		data() {
			return {
				nums: [],
				index: 0,
				title: '请输出密码'
			}
		},
		created() {
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
									PROXY.exit()
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
		},
		computed: {
			password() {
				return this.$store.state.config.password || '8888'
			}
		}
	})
})()


