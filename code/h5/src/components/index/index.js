(()=>{
	// 模版
	const template = `
		<transition>
			<div>
				<mixc-index-ads @route="handleAdsNav"></mixc-index-ads>
				<mixc-index-nav @route="handleAdsNav"></mixc-index-nav>
				<mixc-index-widget></mixc-index-widget>
				<mixc-index-category @route="handleAdsNav"></mixc-index-category>
			</div>
		</transition>`
	
	// 注册组件
	Vue.component('mixc-index', {
		template: template,
		methods: {
			handleAdsNav(row) {
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
		}
	})
})()
