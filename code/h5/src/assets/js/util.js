function filterArray(arr, property, value) {
	return arr.filter(i => i[property] == value)
}

const WEEKS = ['日','一','二','三','四','五','六']
function formatDate() {
	const now = new Date()
	const month = now.getMonth() + 1
	const date = now.getDate()
	const hours = now.getHours()
	const minutes = now.getMinutes()
	return {
		year: now.getFullYear(),
		month: month > 9 ? month : ('0' + month),
		date: date > 9 ? date : ('0' + date),
		week: WEEKS[now.getDay()],
		hours: hours > 9 ? hours : ('0' + hours),
		minutes: minutes > 9 ? minutes : ('0' + minutes),
	}
}

function formatShopPosition(position) {
	if(position && position.length > 0) {
		return position.replace(/^([^-]+)/, '<strong>$1</strong>')
	}
	return position
}
