((w)=> {
	const isCSharp = !!w.CAjax
	w.PROXY = {
		getJSON(api, success, fail) {
			if(isCSharp) {
				CAjax.getJSON(api, (jsonString) => {
					try {
						const data = JSON.stringify(jsonString)
						if(data) {
							success(data)
						} else {
							fail && fail()
						}
					} catch(err) {
						fail && fail()
					}
				}, fail)
			} else {
				$.getJSON(api, null, (data)=> {
					if(data) {
						success(data)
					} else {
						fail && fail()
					}
				}, 'json').fail(() => {
					fail && fail()
				})
			}
		},
		
		getConfig() {
			if(isCSharp) {
				const configJSONString = CBrowser.getConfig()
				try {
					const config = JSON.parse(configJSONString)
					return config
				} catch(err) {
					return { server: 'cky.ritacc.net', port: '8888', sourceId: '1' }
				}
			} else {
				return { server: 'cky.ritacc.net', port: '8888', sourceId: '1' }
			}
		},
		
		getConfigByKey(key, defaultValue) {
			const config = w.getConfig()
			return config[key] || defaultValue
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
	}
})(window)
