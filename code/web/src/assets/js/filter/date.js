import moment from 'moment'

export default {
	name: 'date',
	filter (val, format) {
		return moment(val).format(format || 'YYYY-MM-DD HH:mm:ss')
	}
}
