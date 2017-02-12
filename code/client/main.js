const {app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let startWindow = null

function createWindow () {
  // Create the browser window.
  startWindow = new BrowserWindow({width: 400, height: 300, alwaysOnTop: true, frame: false, resize: false, center: true })

  // and load the index.html of the app.
  startWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'start.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
	startWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  startWindow.on('closed', () => { startWindow = null })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//
//app.on('activate', () => {
//// On macOS it's common to re-create a window in the app when the
//// dock icon is clicked and there are no other windows open.
//if (win === null) {
//  createWindow()
//}
//})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 启动主界面
const cv = require('./js/checkversion.js')
let mainWindow = null
ipcMain.on('open-main', () => {
	mainWindow = new BrowserWindow({ alwaysOnTop: true, modal: true, fullscreen: true, frame: false, })
	mainWindow.setMenu(null)
	mainWindow.loadURL(url.format({
	  	pathname: cv.getMainPath(),
	    protocol: 'file:',
	    slashes: true
	}))
	startWindow && startWindow.close()
	mainWindow.on('closed', () => { startWindow = null })
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
//	settingWindow.webContents.openDevTools()
});