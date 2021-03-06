(()=>{
	// 模版
	const template = `
		<mixc-public-modal @close="$emit('close')" class="setting">
		    <h3 slot="header">设置</h3>
		    <div slot="body">
	    		<form>
    				<div class="form-row">
					<div class="form-label">名称</div>
					<input v-model="formData.name" class="form-input" placeholder="请输入当前设备的名称"/>
				</div>
    				<div class="form-row">
					<div class="form-label">机器码</div>
					<input v-model="formData.code" class="form-input" placeholder="请输入机器吗" readonly="readonly"/>
				</div>
				<div class="form-row">
					<div class="form-label">注册码</div>
					<input v-model="formData.sn" class="form-input" type="text" placeholder="请输入注册码"/>
				</div>
	    		</form>
	    		<div style="font-size: 12px;">
	    			当前版本: {{ formData.version }}<br/>
	    			终端版本: {{ formData.shellVersion }}
	    		</div>
	    		<div style="font-size: 12px;display:none;">
	    			更新时间：{{ new Date(formData.updateTime).toLocaleString() }}
	    		</div>
		    </div>
		    <div slot="footer" class="form-row">
		    		<button class="modal-default-button" @click="handleSubmit">保存</button>
		    		<button class="modal-default-button" @click="$emit('close')">关闭</button>
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
				layer.open({
				    type: 2
				    ,content: '加载中'
				  })
				PROXY.setName(this.formData.name, (rst, msg) => {
					if(rst) {
						PROXY.register(this.formData.sn, (rst, msg) => {
							layer.closeAll()
							if(rst) {
								this.$emit('close')
							} else {
								layer.open({
								    content: msg
								    ,skin: 'msg'
								    ,time: 2 //2秒后自动关闭
								})
							}
						})	 
					} else {
						layer.closeAll()
						layer.open({
						    content: msg
						    ,skin: 'msg'
						    ,time: 2 //2秒后自动关闭
						})
					}
						
				})
			},
		},
		computed: {
			formData() {
				return this.$store.state.config
			}
		}
	})
})()


