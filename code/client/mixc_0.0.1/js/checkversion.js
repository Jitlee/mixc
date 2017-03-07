const fs = require('fs');
const path = require('path')

const dataPath = getUserFolderPath();
let configPath = path.join(path.dirname(process.execPath), 'config.json')
let config = { server: 'cky.ritacc.net', port: 8888, updateTime: 1485012010437, version: '0.0.1', sourceId: 1, adsTime: 3 }
	
function getMainPath(fileName = 'index.html') {
	const config = readConfig()
	const uuid = md5(config.version, config.updateTime);
	const mixcPath = path.join(dataPath, 'mixc');
	const localPath = path.join(mixcPath, uuid);
	if(fs.existsSync(localPath)) {
		return path.join(localPath, fileName);
	} else {
		resetConfig()
		return path.join(__dirname, '../mixc_0.0.1', fileName);
	}
}

function readConfig() {
	try {
		const text = fs.readFileSync(configPath, 'utf8')
		const data = JSON.parse(text)
  		extend(config, data)
	} catch(e) { }
	return config
}

function saveConfig(newCofing, callback) {
	fs.writeFile(configPath, JSON.stringify(newCofing),function(err){  
        if(err) {
        	callback && callback(err)
        } else {
        	extend(config, newCofing)
        	callback && callback(null)
        }
    }); 
}

function resetConfig() {
	let newConfig = extend({}, config)
	newConfig.version = '0.0.1'
	saveConfig(newConfig)
}

function getUserFolderPath() {
	return process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local')
}

function formatVersion(version) {
	return version.split('.').map((n, i) => Number(n) * Math.pow(2, (2-i))).reduce((a,b) => a + b)
}

function urlTrim(url) {
	return url.replace(/^http:\/\//, '').replace('/\/$/', '')
}

function formatTime(time) {
	var date = new Date(time);
	return [
		date.getFullYear(), '-', 
		padStart(date.getMonth()), '-',
		padStart(date.getDate()), ' ',
		padStart(date.getHours()), ':',
		padStart(date.getMinutes()), ':',
		padStart(date.getSeconds())
	].join('');
}

function padStart(val) {
	if(Number(val) < 10) {
		return '0' + String(val)
	}
	return val
}

/* 
* @param {Object} target 目标对象。 
* @param {Object} source 源对象。 
* @param {boolean} deep 是否复制(继承)对象中的对象。 
* @returns {Object} 返回继承了source对象属性的新对象。 
*/ 
function extend(target, /*optional*/source, /*optional*/deep) { 
	target = target || {}; 
	var sType = typeof source, i = 1, options; 
	if( sType === 'undefined' || sType === 'boolean' ) { 
		deep = sType === 'boolean' ? source : false; 
		source = target; 
		target = this; 
	} 
	if( typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]' ) 
		source = {}; 
	while(i <= 2) { 
		options = i === 1 ? target : source; 
		if( options != null ) { 
			for( var name in options ) { 
				var src = target[name], copy = options[name]; 
				if(target === copy) 
					continue; 
				if(deep && copy && typeof copy === 'object' && !copy.nodeType) 
					target[name] = this.extend(src || 
						(copy.length != null ? [] : {}), copy, deep); 
				else if(copy !== undefined) 
					target[name] = copy; 
				} 
			} 
		i++; 
	} 
	return target; 
}

module.exports = {
	config: config,
	readConfig: readConfig,
	saveConfig: saveConfig,
	extend: extend,
	formatTime: formatTime,
	getMainPath: getMainPath
}