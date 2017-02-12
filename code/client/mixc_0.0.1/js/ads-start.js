(function(w) {
	if(!require) {
		return
	}
	
	const remote = require('electron').remote
	const BrowserWindow = remote.BrowserWindow
	const app = remote.app;
	const url = require('url')
	const path = require('path')
	const TIMEOUT = 1e4
	let lastActiveTime = new Date().getTime()
	w.addEventListener('click', refreshTime)
	function beginTiming() {
		timeHandler = w.setTimeout(() => {
			let now = new Date().getTime()
			if(now - lastActiveTime > TIMEOUT) {
				showAds()
			} else {
				beginTiming()
			}
		}, TIMEOUT)
	}
	
	function refreshTime() {
		lastActiveTime = new Date().getTime()
	}
	
	let ads = null
	function createAds() {
		const parent = remote.getCurrentWindow()
		ads = new BrowserWindow({ parent: parent, modal: true, frame: false, skipTaskbar: true })
		ads.setMenu(null)
		ads.setFullScreen(true)
		ads.setAlwaysOnTop(true)
		
	    ads.hide()
	    
		// and load the index.html of the app.
		ads.loadURL(url.format({
		  	pathname: path.join(__dirname, 'ads.html'),
		    protocol: 'file:',
		    slashes: true
		}))
		
		ads.on('closed', () => {
		    ads = null
		    refreshTime()
		    beginTiming()
		})
		// Open the DevTools.
		ads.webContents.openDevTools()
	}
	
	function showAds() {
		ads && ads.show()
	}
	
	createAds()
	
	beginTiming()
})(window)
