(function(w) {
	if(!w.require) {
		return
	}
	
	const { ipcRenderer } = require('electron')
	const cv = App.getConfigManager()
	
	let TIMEOUT = 180 // 单位秒
	let lastActiveTime = new Date().getTime()
	w.addEventListener('click', refreshTime)
	let timeHandler = 0
	let isStop = false
	function beginTiming() {
		isStop = false
		w.clearTimeout(timeHandler)
		
		const config = cv.readConfig();
		if(config.adsTime > 0) {
			TIMEOUT = config.adsTime
		}
		
		timeHandler = w.setTimeout(() => {
			let now = new Date().getTime()
			if(now - lastActiveTime > TIMEOUT) {
				isStop = true
				lastActiveTime = now
				ipcRenderer.send('open-ads')
				window.__backHome()
			} else {
				beginTiming()
			}
		}, TIMEOUT * 1000)
	}
	
	function refreshTime() {
		lastActiveTime = new Date().getTime()
	}
	
	ipcRenderer.on('auto-ads', beginTiming)
	
	beginTiming()
})(window)
