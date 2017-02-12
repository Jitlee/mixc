(function(w) {
	if(!require) {
		return
	}
	
	const remote = require('electron').remote
	w.addEventListener('click', () => {
		remote.getCurrentWindow().close()
	});
})(window)
