const {app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

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
	mainWindow = new BrowserWindow({ alwaysOnTop: true, modal: true, fullscreen: true, frame: false, resize: false, center: true })
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

// 启动设置页面
ipcMain.on('open-setting', () => {
	const settingWindow = new BrowserWindow({width: 600, height: 400, alwaysOnTop: true, parent: mainWindow, model: true, frame: false, resize: false, center: true })
	settingWindow.setMenu(null)
  settingWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'setting.html'),
    protocol: 'file:',
    slashes: true
  }))
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
    slashes: true
  }))
  adsWindow.on('closed', () => { 
  	adsWindow = null
  	evt.sender.send('auto-ads')
  })
})

// 定时更新
let updateTimeHandler = 0
const CHECK_VERSION_INTERVAL = 5000
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
			return
		}
		mainWindow.loadURL(url.format({
		  pathname: cv.getMainPath('index.html'),
		  protocol: 'file:',
		  slashes: true
		}))
		console.log('auto update sucess： ' + new Date().toTimeString())
	}, true)
}
autoUpdate()
