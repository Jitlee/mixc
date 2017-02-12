const {app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
	
const cv = require('./js/checkversion.js')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ backgroundColor: '#7fb80e', skipTaskbar: true })
  win.maximize()
  win.setMenu(null)
win.setAlwaysOnTop(true)
  win.setFullScreen(true)
	
	win.loadFromConfig= function() {
		win.loadURL(url.format({
	    pathname: cv.getPathName(),
	    protocol: 'file:',
	    slashes: true
	  }))
	}
	
	win.loadFromConfig() // 加载和重复加载
//// and load the index.html of the app.
//win.loadURL(url.format({
//  pathname: cv.getPathName(),
////  pathname: path.join(__dirname, 'index.html'),
////  pathname: path.join('cky.ritacc.net:8888/release/0.0.40/index.html'),
//  protocol: 'file:',
//  slashes: true
//}))

  // Open the DevTools.
//win.webContents.openDevTools()

	
	let _top = new BrowserWindow({ top: win, frame: false, transparent: true, x: 0, y: 0, width: 50, height: 50, skipTaskbar: true })
  	_top.setMenu(null)
	_top.setAlwaysOnTop(true)
	_top.loadURL(url.format({ parent: win, pathname: path.join(__dirname, 'top.html'), protocol: 'file:', slashes: true }))
	_top.parent = win
	
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    _top.close()
    win = null
  })
  
	win.webContents.on('new-window', () => {
	})
		// Open the DevTools.
//	_top.webContents.openDevTools()
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

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

//const ipc = require('electron').ipcRenderer
//console.log(ipc)
//ipc.on('setting', openSetting)
//function openSetting() {
//	let setting = new BrowserWindow({ parent: win, modal: true, width: 600, height: 600, frame: false});
//	setting.setMenu(null)
//	// and load the index.html of the app.
//	setting.loadURL(url.format({
//	  	pathname: path.join(app.getAppPath(), 'setting.html'),
//	    protocol: 'file:',
//	    slashes: true
//	}))
//		// Open the DevTools.
////		win.webContents.openDevTools()
//}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.