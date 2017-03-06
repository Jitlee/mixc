(function(w) {
	if(!w.require) {
		return
	}
	
	const { ipcRenderer } = require('electron')
	
	let TIMEOUT = 3
//	const TIMEOUT = 10*1000
	let lastActiveTime = new Date().getTime()
	w.addEventListener('click', refreshTime)
	let timeHandler = 0
	let isStop = false
	function beginTiming() {
		isStop = false
		w.clearTimeout(timeHandler)
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
//		}, TIMEOUT * 60 * 1000)
		}, 10000)
	}
	
	function refreshTime() {
		lastActiveTime = new Date().getTime()
	}
	
	ipcRenderer.on('auto-ads', beginTiming)
	
	ipcRenderer.on('ads-time', (evt, timeout) => {
//			console.log('开始设置广告时间:' + timeout + '几分钟')
		if(!(timeout > 0) || timeout == TIMEOUT) {
			return
		}
		
		TIMEOUT = timeout;
		if(!isStop) {
//			console.log('重新设置了进入广告时间:' + timeout + '几分钟')
			beginTiming()
		}
	})
	
	beginTiming()
})(window)
