(()=>{
	window.__STORE__ = {
		state: {
			ads: [],
			floors: [],
			shops: [],
			shopTypes: [],
			albums: [],
			articles: [],
			activities: [], 
			pois: [],
			
			config: {},
			
			brand: {
				tab: 0,
				filterIndex: -1,
				subFilterIndex: -1,
			},
			floor: {
				index: 0,
				_lettersVisible: false,
				_selectedLetter: null,
				shop: null,
			},
		},
		actions: {
		}
	}
})()
