// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

// 状态管理
import store from './vuex/store'
import Vuex from 'vuex'

// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.css'

// 自定义组件
import './components/public/index'
import date from './assets/js/filter/index'

 // 页面顶部进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { routes } from './router-config'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)

const router = new VueRouter({ routes: routes })

router.beforeEach((to, from, next) => { NProgress.start(); next() })

router.afterEach(transition => { NProgress.done() })

// httpd 设置
Vue.http.options.emulateJSON = true

Vue.http.interceptors.push(function(request, next) {
//	
//	if(request.url.indexOf('http://') != 0) {
//		request.url = 'http://localhost:8001' + request.url
//	}
	
　　	next(function(response) {
		if(typeof this.formLoading == "boolean") {
			this.formLoading = false;
		}
		if(typeof this.loading == "boolean") {
			this.loading = false;
		}
		if(response.data) {
			if(response.data.code == 200) {
				response.nice = true;
				if(response.data.msg) {
					if(typeof this.formVisible == "boolean") {
						this.formVisible = false;
					}
					this.$message({ message: response.data.msg, type: 'success' });
				}
			} else if(response.data.msg) {
				this.$message.error(response.data.msg);
			}
	  	} else {
	  		this.$message.error('网络异常，请稍后再试');
	 	}
　　		return response;
  	});
});

new Vue({
  el: '#app',
  template: '<App/>',
  router: router,
  store,
  components: { App }
  //render: h => h(App)
}).$mount('#app')