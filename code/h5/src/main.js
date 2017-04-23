((w)=>{
	// 定义router
	const router = new VueRouter({ routes: w.__ROUTERS__ })
	// 定义store
	const store = new Vuex.Store(w.__STORE__)
	// 启动APP
	new Vue({ router, store }).$mount('#app')
	
	// 加载所有数据
	loadData(['ads']) // 广告
	
	function loadData(arr) {
		arr.forEach(name => {
			PROXY.getJSON(`data/${name}.json`, (rst) => {
				if(rst && rst.length > 0) {
					store.state[name] = rst
				}
			})
		})
	}
})(window)
