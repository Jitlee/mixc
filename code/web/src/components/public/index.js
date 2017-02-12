import Vue from 'vue'
import Upload from './Upload.vue'
import Album from './Album.vue'
import Card from './Card.vue'

const install = function(Vue, opts = {}) {
	Vue.component(Upload.name, Upload)
	Vue.component(Album.name, Album)
	Vue.component(Card.name, Card)
}

install(Vue)

module.exports = {
	version: '1.0.0',
	install,
	Upload,
	Album,
	Card
}