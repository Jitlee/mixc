const fs = require('fs');
const path = require('path')

const zip = require('machinepack-zip');
const request = require('request');
const md5 = require('md5');
const BUILD_VERSION = '0.0.35' // 客户端打包内嵌版本

const dataPath = getUserFolderPath();
let configPath = path.join(path.dirname(process.execPath), 'config.json')
let config = { server: 'cky.ritacc.net', port: 8888, updateTime: 1485012010437, version: '0.0.1', sourceId: 1, adsTime: 3 }
	
/**
 * 此方法,由于路径的问题，只限于main.js调用
 * @param {Object} fileName
 */
function getMainPath(fileName = 'index.html') {
	const config = readConfig()
	const uuid = md5(config.version + config.updateTime);
	const mixcPath = path.join(dataPath, 'mixc');
	const localPath = path.join(mixcPath, uuid);
	if(fs.existsSync(localPath)) {
		return path.join(localPath, fileName);
	} else {
		return path.join(__dirname, '../mixc_0.0.1', fileName)
	}
}

function isUpdated(config) {
	if(config.version == BUILD_VERSION) {
		return true
	}
	const uuid = md5(config.version + config.updateTime);
	const mixcPath = path.join(dataPath, 'mixc');
	const localPath = path.join(mixcPath, uuid);
	return fs.existsSync(localPath)
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

function checkVersion(callback, autoUpdate, process) {
//	callback(0, '已经是最新版本');
//	return;
	const config = readConfig()
	const url = ['http://', urlTrim(config.server), ':', config.port, '/api/release/last/', config.sourceId].join('');
	getJSON(url, function(rst) {
		if(formatVersion(rst.releaseVersion) != formatVersion(config.version) || !isUpdated(config)) {
			if(autoUpdate) {
				process && process(1)
				update(config, rst, callback, process)
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

function update(lastConfig, rst, callback, process) {
	const fileUrl = ['http://', urlTrim(lastConfig.server),
			':', lastConfig.port, '\/', rst.releaseFile].join('');
	const now = new Date().getTime();
	const uuid = md5(rst.releaseVersion + now);
	const mixcPath = path.join(dataPath, 'mixc');
	const zipPath = path.join(mixcPath, uuid + '.zip');
	const outPath = path.join(mixcPath, uuid);
	checkPath(mixcPath, function(flag) {
		if(!flag) {
			callback(-3, '创建临时目录失败');
			return
		}
		
		process && process(2)
		request({url: fileUrl, encoding: null}, function(err, resp, body) {
			if(err) {
		  		callback(-2, '下载资源包失败');
		  	} else {
		  		process && process(3)
			  	fs.writeFile(zipPath, body, function(err) {
			  		if(err) {
			  			callback(-4, '资源包写入失败');
			  			return
			  		}
			  		process && process(4)
			    	zip.unzip({ source: zipPath, destination: outPath, }).exec({
						error: function (err) {
					 		callback(-5, '解压资源包失败');
						},
						success: function () {
							process && process(5)
							const lastUUID = md5(lastConfig.version + lastConfig.updateTime);
							const lastPath = path.join(mixcPath, lastUUID);
							let newConfig = extend({}, lastConfig)
							newConfig.version = rst.releaseVersion
							newConfig.updateTime = now
							saveConfig(newConfig, (err) => {
								if(err) {
									callback(-6, '保存最新的配置失败');
								} else {
									try {
										deleteFolderRecursive(zipPath)
										deleteFolderRecursive(lastPath);
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

function getJSON(url, success, error) {
	request({ url: url }, (err, response, body) => {
		if (err) {
			error(err)
		} else if(response.statusCode == 200) {
			try {
    				const data = JSON.parse(body)
    				if(data && data.code == 200) {
            			success(data.rst)
	            	} else {
	            		error()
	            	}
	    		} catch(e) {
	    			error(e)
	    		}
    		} else {
    			error()
    		}
	})
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