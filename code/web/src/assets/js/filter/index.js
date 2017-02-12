import Vue from 'vue'
import DateFilter from './date'

const install = function(Vue, opts = {}) {
	Vue.filter(DateFilter.name, DateFilter.filter)
}

install(Vue)

module.exports = {
	version: '1.0.0',
	install,
	DateFilter
}