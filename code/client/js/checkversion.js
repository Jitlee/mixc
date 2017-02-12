const fs = require('fs');
const path = require('path')

const zip = require('machinepack-zip');
const request = require('request');
const md5 = require('md5');

const dataPath = getUserFolderPath();
let configPath = path.join(path.dirname(process.execPath), 'config.json')
let config = { server: 'cky.ritacc.net', port: 8888, updateTime: 1485012010437, version: '0.0.1', sourceId: 1 }
	
function getMainPath() {
	const config = readConfig()
	const uuid = md5(config.version, config.updateTime);
	const mixcPath = path.join(dataPath, 'mixc');
	const localPath = path.join(mixcPath, uuid);
	if(fs.existsSync(localPath)) {
		return path.join(localPath, 'index.html');
	} else {
		resetConfig()
		return path.join(__dirname, '../mixc_0.0.1/index.html');
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

function checkVersion(callback, autoUpdate) {
	const config = readConfig()
	const url = ['http://', urlTrim(config.server), ':', config.port, '\/api/release/last/', config.sourceId].join('');
	getJSON(url, function(rst) {
		if(formatVersion(rst.releaseVersion) > formatVersion(config.version)) {
			if(autoUpdate) {
				update(config, rst, callback)
			} else {
				callback(1, rst)
			}
		} else {
			callback(0, '已经是最新版本')
		}
	}, function() {
		callback(-1, '检查版本失败')
	})
}

function update(config, rst, callback) {
	const fileUrl = ['http://', urlTrim(config.server),
			':', config.port, '\/', rst.releaseFile].join('');
	const now = new Date().getTime();
	const uuid = md5(rst.releaseVersion, now);
	const mixcPath = path.join(dataPath, 'mixc');
	const zipPath = path.join(mixcPath, uuid + '.zip');
	const outPath = path.join(mixcPath, uuid);
	checkPath(mixcPath, function(flag) {
		if(!flag) {
			callback(-3, '创建临时目录失败');
			return
		}
		request({url: fileUrl, encoding: null}, function(err, resp, body) {
			if(err) {
		  		callback(-2, '下载资源包失败');
		  	} else {
			  	fs.writeFile(zipPath, body, function(err) {
			  		if(err) {
			  			callback(-4, '资源包写入失败');
			  			return
			  		}
			    	zip.unzip({ source: zipPath, destination: outPath, }).exec({
						error: function (err) {
					 		callback(-5, '解压资源包失败');
						},
						success: function () {
							let newConfig = cv.extend({}, config)
							newConfig.version = rst.releaseVersion
							newConfig.updateTime = rst.now
							saveConfig(newConfig, (err) => {
								if(err) {
									callback(-6, '保存最新的配置失败');
								} else {
									const lastUUID = md5(config.version, config.updateTime);
									const lastPath = path.join(mixcPath, lastUUID);
									try {
										deleteFolderRecursive(zipPath)
										deleteFolderRecursive(lastUUID);
									} catch(e) { console.error('删除旧资源失败' + e) }
									
							 		callback(1, rst);
								}
							})
						},
					});
				});
		  	}
		});
	});
}

function deleteFolderRecursive(path) {
  	if(fs.existsSync(path)) {
		if(fs.lstatSync(path).isDirectory()) {
    		fs.readdirSync(path).forEach(function(file,index){
	      		var curPath = path + "/" + file;
	      		if(fs.lstatSync(curPath).isDirectory()) { // recurse
	        		deleteFolderRecursive(curPath);
	      		} else { // delete file
	        		fs.unlinkSync(curPath);
	      		}
	    	});
	    	fs.rmdirSync(path);
  		} else {
  			fs.unlinkSync(path);
  		}
  	}
};

function checkPath(target, callback) {
	fs.exists(target, function(exists) {
		if(exists) {
			callback(true)
		} else {
			fs.mkdir(target, 0777, function(err){
		 		if(err){
		  			callback(false)
				}else{
			  		callback(true)
			 	}
			})
		}
	})
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
};

function getJSON(url, success, error){
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if(xhr.status==200){
                try {
                	const data = JSON.parse(xhr.responseText)
                	if(data && data.code == 200) {
                		success(data.rst)
                	} else {
                		error()
                	}
                } catch(e) {
                	error()
                }
            } else {
            	error()
            }
        }
    }
    xhr.send(null);
}

module.exports = {
	config: config,
	readConfig: readConfig,
	saveConfig: saveConfig,
	checkVersion: checkVersion,
	extend: extend,
	formatTime: formatTime,
	getMainPath: getMainPath
}