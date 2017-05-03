((w)=> {
	const isCSharp = !!w.CAjax
	w.PROXY = {
		getJSON(api, success, fail) {
			if(isCSharp) {
				CAjax.getJSON(api, (jsonString) => {
					try {
						const data = JSON.parse(jsonString)
						if(data) {
							success(data)
						} else {
							fail && fail()
						}
					} catch(err) {
						fail && fail()
					}
				}, fail)
			} else if(w.$) {
				$.getJSON(api, null, (data)=> {
					if(data) {
						success(data)
					} else {
						fail && fail()
					}
				}, 'json').fail(() => {
					fail && fail()
				})
			} else {
			    const xhr = new XMLHttpRequest()
			    xhr.open('get', api, true)
			    xhr.onreadystatechange=function(){
			        if(xhr.readyState==4){
			            if(xhr.status==200){
			                try {
			                	const data = JSON.parse(xhr.responseText)
			                	if(data && data.length > 0) {
		                			success(data)
		                		}
			                } catch(e) {
			                	error()
			                }
			            } else {
			            	error()
			            }
			        }
			    }
			    xhr.send(null)
			}
		},
		
		getConfig() {
			if(isCSharp) {
				const configJSONString = CBrowser.getConfig()
				try {
					const config = JSON.parse(configJSONString)
					return config
				} catch(err) {
					return { server: 'cky.ritacc.net', port: '8888', sourceId: '1',code:'1111-1111', sn:'89DRI0EDD98', version: '0.0.1' }
				}
			} else {
				return { server: 'cky.ritacc.net', port: '8888', sourceId: '1',code:'1111-1111', sn:'89DRI0EDD98', version: '0.0.1' }
			}
		},
		
		getConfigByKey(key, defaultValue) {
			if(isCSharp) {
				return CBrowser.getConfigByKey(key, defaultValue)
			}
			return defaultValue
		},
		
		saveConfig(config) {
			if(isCSharp) {
				const configJSONString = JSON.stringify(config)
				CBrowser.setConfig(configJSONString)
			}
		},
		
		exit() {
			if(isCSharp) {
				CBrowser.exit()
			} else {
				w.close()
			}
		},
		
		close() {
			if(isCSharp) {
				CBrowser.close()
			} else {
				w.close()
			}
		},
		
		playAds() {
			if(isCSharp) {
				CBrowser.playAds()
			}
		},
		
		register(sn, callback) {
			if(isCSharp) {
				CBrowser.register(String(sn), callback)
			} else {
				callback(true)
			}
		},
		
		setName(name, callback) {
			if(isCSharp) {
				CBrowser.setName(String(name), callback)
			} else {
				callback(true)
			}
		},
	}
})(window)
