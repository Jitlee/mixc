(function(w, d){
	if(!require) return
	let actions = [];
	var timeoutHandle = 0;
	w.addEventListener('click', function(evt) {
		window.setTimeout(timeoutHandle);
		if(evt.clientX < 50 && evt.clientY < 50) {
			evt.preventDefault();
			actions.push(new Date().getTime())
			timeoutHandle = window.setTimeout(() => {
				actions.length = 0
			}, 5000);
			
			if(actions.length > 4) {
				if(actions[actions.length - 1] - actions[0] < 5000) {
					const { ipcRenderer } = require('electron')
					ipcRenderer.send('open-setting', null)
				}
			}
		}
	})
})(window, document);