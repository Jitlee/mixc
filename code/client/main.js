const {app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const request = require('request')

const nodeConsole = require('console');
const console = new nodeConsole.Console(process.stdout, process.stderr);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let startWindow = null

function createWindow () {
  startWindow = new BrowserWindow({width: 400, height: 300, alwaysOnTop: true, frame: false, resize: false, center: true })

  startWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'start.html'),
    protocol: 'file:',
    slashes: true
  }))

  startWindow.on('closed', () => { startWindow = null })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})


const cv = require('./js/checkversion.js')
// 启动主界面
let mainWindow = null
ipcMain.on('open-main', () => {
	autActive(() => {
		mainWindow = new BrowserWindow({ alwaysOnTop: true, fullscreen: true, frame: false, resize: false, center: true })
		mainWindow.setMenu(null)
		mainWindow.loadURL(url.format({
		  	pathname: cv.getMainPath('index.html'),
		    protocol: 'file:',
		    slashes: true
		}))
		startWindow && startWindow.close()
		mainWindow.on('closed', () => { mainWindow = null })
		mainWindow.webContents.openDevTools()
	})
})

// 启动设置页面
let settingWindow = null
ipcMain.on('open-setting', () => {
	if(settingWindow !=null) {
		return settingWindow
	}
	settingWindow = new BrowserWindow({width: 600, height: 600, alwaysOnTop: true, parent: mainWindow, model: true, frame: false, resize: false, center: true })
	settingWindow.setMenu(null)
  settingWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'setting.html'),
    protocol: 'file:',
  }))
	settingWindow.on('closed', () => { settingWindow = null })
})

// 启动广告页面
let adsWindow = null
ipcMain.on('open-ads', (evt) => {
	if(adsWindow) { return }
	adsWindow = new BrowserWindow({ parent: mainWindow,alwaysOnTop: true, modal: true, fullscreen: true, frame: false, resize: false, center: true })
	adsWindow.setMenu(null)
  adsWindow.loadURL(url.format({
    pathname: cv.getMainPath('ads.html'),
    protocol: 'file:',
  }))
	adsWindow.on('closed', () => { 
		adsWindow = null
		evt.sender.send('auto-ads')
	})
})

// 定时更新
let updateTimeHandler = 0
const CHECK_VERSION_INTERVAL = 15*60*1000 // 15分钟检查更新一次
function autoUpdate() {
	clearTimeout(updateTimeHandler)
	updateTimeHandler = setTimeout(checkVersion, CHECK_VERSION_INTERVAL)
}

function checkVersion() {
	console.log('begin auto check version:  ' + new Date().toTimeString())
	cv.checkVersion((rst, msg, err) => {
		console.log('check version result:  ' + rst + ', ' + new Date().toTimeString())
		if(err) {
			console.log(err)
		}
		if(!(rst == 2 && mainWindow)) {
			autoUpdate()
			return
		}
		mainWindow.loadURL(url.format({
		  pathname: cv.getMainPath('index.html'),
		  protocol: 'file:',
		  slashes: true
		}))
		console.log('auto update sucess： ' + new Date().toTimeString())
		autoUpdate()
	}, true)
}
autoUpdate()

// 定时心跳
const powerOff = require('power-off');
const ip = require('ip')
const mac = require('getmac')
const ACTIVE_INTERVAL = 1*60*1000 // 3分钟检查更新一次
const ipAddress = ip.address() // 本机ip
const config = cv.readConfig()
let activeData = { ip: ipAddress };
mac.getMac((err, address) => {
	if(err) {
		console.log('get mac failed： ', err);
		return
	}
	activeData.mac = address
	console.log('get mac sucess： ', activeData)
	setInterval(autActive, ACTIVE_INTERVAL)
	autActive()
})
function autActive(callback) {
	// 发送心跳
	const url = ['http://', config.server, ':', config.port, '/api/terminal/active/', config.sourceId].join('');
	console.log('active url: ' + url)
	request.post({ url:url, form: activeData }, (err, response, body) => {
		if(response && response.statusCode == 200) {
			try {
				const data = JSON.parse(body)
				if(data && data.code == 200) {
					const rst = data.rst
					 // 保存最新的配置
					adsTime = rst.adsTime
					config.adsTime = rst.adsTime
					config.password = rst.password
					config.shutdownTime = rst.shutdownTime
					console.log('the new password: ' + rst.password)
					cv.saveConfig(config)
					// 检测是否需要关机
				}
	    } catch(e) { console.error(e) }
		}
		checkPowerOff()
		if(typeof callback == 'function') {
			callback()
		}
	})
}

// 检测是否需要关机
function checkPowerOff() {
	if(config.shutdownTime > 0) {
		const now = new Date()
		const minutes = now.getHours() * 60 + now.getMinutes();
		if(Math.abs(minutes - config.shutdownTime) * 60 * 1000 < ACTIVE_INTERVAL * 1.5) {
			// 关机
			powerOff((err, stderr, stdout) => {
			    if(!err && !stderr) {
			        console.log(stdout)
			    }
			})
		}
	}
}
