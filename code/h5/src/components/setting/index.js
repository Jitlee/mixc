(()=>{
	// 模版
	const template = `
		<mixc-public-modal @close="$emit('close')" class="setting">
		    <h3 slot="header">服务器设置</h3>
		    <div slot="body">
	    		<form>
	    			<div class="form-row">
						<div class="form-label">服务器IP</div>
						<input v-model="formData.server" class="form-input" placeholder="请输入服务器的IP地址" ma/>
					</div>
					<div class="form-row">
						<div class="form-label">服务器端口号</div>
						<input v-model="formData.port" class="form-input" type="number" placeholder="请输入服务器的端口号" maxlength="5"/>
					</div>
					<div class="form-row">
						<div class="form-label">版本源ID</div>
						<input v-model="formData.sourceId" class="form-input" type="number" placeholder="请输入客户端版本源ID" maxlength="5"/>
					</div>
	    		</form>
	    		<div style="font-size: 12px;">
	    			当前版本: {{ formData.version }}
	    		</div>
	    		<div style="font-size: 12px;">
	    			更新时间：{{ new Date(formData.updateTime).toLocaleString() }}
	    		</div>
		    </div>
		    <div slot="footer" class="form-row">
		    		<button class="modal-default-button" @click="handleSubmit">保存</button>
		    </div>
	  	</mixc-public-modal>
	`
	
	// 注册组件
	Vue.component('mixc-setting', {
		template: template,
		data() {
			return {
				
			}
		},
		created() {
		},
		methods: {
			handleSubmit() {
				this.$emit('close')
				PROXY.saveConfig(this.formData)
			},
		},
		computed: {
			formData() {
				return this.$store.state.config
			}
		}
	})
})()


