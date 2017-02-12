(function(w) {
	if(!w.require) {
		return
	}
	
	const { ipcRenderer } = require('electron')
	
	const TIMEOUT = 3*60*1000
	let lastActiveTime = new Date().getTime()
	w.addEventListener('click', refreshTime)
	let timeHandler = 0
	function beginTiming() {
		w.clearTimeout(timeHandler)
		timeHandler = w.setTimeout(() => {
			let now = new Date().getTime()
			if(now - lastActiveTime > TIMEOUT) {
				ipcRenderer.send('open-ads')
			} else {
				beginTiming()
			}
		}, TIMEOUT)
	}
	
	function refreshTime() {
		lastActiveTime = new Date().getTime()
	}
	
	ipcRenderer.on('auto-ads', beginTiming)
	
	beginTiming()
})(window)
