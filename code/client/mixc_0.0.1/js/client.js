(function(w, d){
	if(!w.require) return
	let actions = [];
	var timeoutHandle = 0;
	d.getElementById('hideDiv').addEventListener('click', function(evt) {
		window.setTimeout(timeoutHandle);
		evt.preventDefault();
		actions.push(new Date().getTime())
		timeoutHandle = window.setTimeout(() => {
			actions.length = 0
		}, 500);
		
		if(actions.length == 2) {
			if(actions[actions.length - 1] - actions[0] < 500) {
				openSetting()
			}
		}
	})
	
	const remote = require('electron').remote
	const BrowserWindow = remote.BrowserWindow
	const app = remote.app;
	const url = require('url')
	const path = require('path')
	function openSetting() {
		const top = remote.getCurrentWindow()
		const parent = top.parent;
		let win = new BrowserWindow({ parent: parent, modal: true, width: 600, height: 600, frame: false, skipTaskbar: true })
		win.setMenu(null)
		// and load the index.html of the app.
		win.loadURL(url.format({
		  	pathname: path.join(app.getAppPath(), 'setting.html'),
		    protocol: 'file:',
		    slashes: true
		}))
		
	    top.hide()
		win.on('closed', () => {
		    top.show()
		    win = null
		  })
		// Open the DevTools.
//		win.webContents.openDevTools()
	}
})(window, document);
