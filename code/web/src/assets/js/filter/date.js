import moment from 'moment'

export default {
	name: 'date1',
	filter (val, format) {
		return moment(val).format(format || 'YYYY-MM-DD HH:mm:ss')
	}
}
