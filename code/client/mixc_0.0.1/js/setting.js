//(function(w, d){
//	if(!w.require) return
//	let actions = [];
//	var timeoutHandle = 0;
//	d.getElementById('hideDiv').addEventListener('click', function(evt) {
//		window.setTimeout(timeoutHandle);
//		evt.preventDefault();
//		actions.push(new Date().getTime())
//		timeoutHandle = window.setTimeout(() => {
//			actions.length = 0
//		}, 500);
//		
//		if(actions.length == 2) {
//			if(actions[actions.length - 1] - actions[0] < 500) {
//				const { ipcRenderer } = require('electron')
//				ipcRenderer.send('open-setting', null)
//			}
//		}
//	})
//})(window, document);