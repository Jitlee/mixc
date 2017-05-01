(function(w) {
	let TIMEOUT = 180 // 单位秒
	let lastActiveTime = new Date().getTime()
	w.addEventListener('mouseup', refreshTime)
	w.addEventListener('touchend', refreshTime)
	let timeHandler = 0
	let isStop = false
	function beginTiming() {
		if(isStop)
		{
			return;
		}
		
		w.clearTimeout(timeHandler)
		
		TIMEOUT = PROXY.getConfigByKey('adsTime', "180")
		timeHandler = w.setTimeout(() => {
			if(isStop) {
				return
			}
			let now = new Date().getTime()
			if(now - lastActiveTime > TIMEOUT * 1000) {
				lastActiveTime = now
				__backHome()
				isStop = true
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
	
	w.__stopAds = function() {
		isStop = true
	}
	w.__beginWatchAdsIdle = function() {
		isStop = false
		beginTiming()
	}
})(window)
