(function(w) {
	let TIMEOUT = 180 // 单位秒
	let lastActiveTime = new Date().getTime()
	w.addEventListener('mouseup', refreshTime)
	w.addEventListener('touchend', refreshTime)
	let timeHandler = 0
	let isStop = false
	function beginTiming() {
		isStop = false
		w.clearTimeout(timeHandler)
		
		TIMEOUT = PROXY.getConfigByKey('adsTime', "180")
		timeHandler = w.setTimeout(() => {
			let now = new Date().getTime()
			if(now - lastActiveTime > TIMEOUT * 1000) {
				isStop = true
				lastActiveTime = now
				__backHome()
				PROXY.playAds()
			} else {
				beginTiming()
			}
		}, TIMEOUT * 1000)
	}
	
	function refreshTime() {
		lastActiveTime = new Date().getTime()
	}
	
	beginTiming()
	
	w.__beginWatchAdsIdle = beginTiming
})(window)
