(function(window){
	let cv = null
	window.App = {
		getConfigManager: function() {
			if(cv) {
				return cv
			}
			
			cv = { readConfig: function() { return {} } }
			if(window.require) {
				const path = require('path')
				const fs = require('fs')
				let cvPath = path.join(localStorage.getItem('checkversion'))
				if(fs.existsSync(cvPath)) {
					cv = require(cvPath)
				}
			}
			return cv
		}
	}
})(window)
