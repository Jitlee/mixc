(()=> {
	window.__ROUTERS__ = [
		{ path: '/', component: {  template: '<mixc-index></mixc-index>' } },
		{ path: '/brand/:typeId', component: {  template: '<mixc-brand></mixc-brand>' } },
		{ path: '/shop/:type/:shopId', component: {  template: '<mixc-shop></mixc-shop>' } },
		{ path: '/floor', component: {  template: '<mixc-floor></mixc-floor>' } },
		{ path: '/activity/:activityId', component: {  template: '<mixc-activity></mixc-activity>' } },
		{ path: '/info', component: {  template: '<mixc-info></mixc-info>' } },
		{ path: '/article/:articleId', component: {  template: '<mixc-article></mixc-article>' } },
	]
})()
