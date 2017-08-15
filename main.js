const os = require('os')
const fs = require('fs')
const path = require('path')
const url = require('url')
const {app, BrowserWindow, dialog, ipcMain} = require('electron')

let main_window


// utility function to log happenings
const _log = function(e, disp) {
	console.error(e);
	fs.access(os.homedir(), fs.constants.W_OK | fs.constants.R_OK, (err) => {
		if(err)
			return console.error(err)

		let _logfile = path.join(os.homedir(), '.comboplayer', 'comboplayer-errorlog.txt')
		fs.appendFile(_logfile, Date() + ' ::: ' + e.message + '\n', (err) => {
			if (err) {
				console.error(err.code)
				if (err.code == 'ENOENT') {
					let _folderpath = _logfile.slice(0, _logfile.lastIndexOf('/'))
				console.log(_folderpath)
					fs.mkdir(_folderpath, (err) => {
						if (err) {
							return console.error(err)
						}
						fs.appendFile(_logfile, Date() + ' ::: ' + e.message + '\n', (err) => {
							if(err)
								console.error(err)
						})
					})
				}
			}
		})
	})
	if(disp)
		dialog.showMessageBox({
			buttons: ['OK'],
			message: 'A fatal event has occured! Uncaught exception:\n' + e,
			type: 'error'
		})
}

//handle all unhandled exceptions here
process.on('unhandledException', (err) => {
	_log(err)
	process.exit(1)
})

//set ipc
ipcMain.on('log', (evt, msg, opt) => {
	_log(msg, opt)
})

ipcMain.on('appQuit', (evt, msg) => {
	if(app && app.isReady())
		app.quit()
})

ipcMain.on('mainwndMinimize', (evt, msg) => {
	if(main_window)
		main_window.minimize()
})

ipcMain.on('mainwndMaximize', (evt, msg) => {
	if(main_window){
		if (main_window.isMaximized()) {
			main_window.restore()
		} else {
			main_window.maximize()
		}
	}
})

ipcMain.on('dialog', (evt, msg) => {
	dialog.showMessageBox(msg)
})

ipcMain.on('openFile', evt => {
	if(main_window){
		dialog.showOpenDialog(main_window,{
			title: 'Load media file',
			message: 'Select a media file to play',
			filters: [{name: 'Audio', extensions: ['mp3', 'mp4', 'ogg', 'wav', 'flac', 'm4a']}, {name: 'Video', extensions: ['mp4', 'mkv', 'avi']}],
			properties: ['openFile'],
			defaultPath: os.homedir()
		}, files => {
			// console.log(files)
			if(files)
				evt.sender.send('openFileResp', files[0])
		})
	}
})

// app stuff
if (app.makeSingleInstance((args, wd) => {
	if(main_window){
		if(!main_window.isFocused()){
			main_window.restore()
			main_window.focus()
		}
	}
}) == true) {
	app.quit();
}

app.on('ready', (launch_info) => {
	main_window = new BrowserWindow({
		width: 1210,
		height: 550,
		minWidth: 800,
		minHeight: 510,
		title: 'Combo Player',
		show: false,
		frame: false,
		icon: '',
		transparent: true
		// titleBarStyle: 'hidden'
	})

	const index_html = Object.freeze({
		slashes: true,
		protocol: 'file',
		pathname: path.join(__dirname, 'renders', 'index.html')
	})

	main_window.loadURL(url.format(index_html))

	main_window.on('ready-to-show', () => {
		main_window.show()
	})

	main_window.webContents.openDevTools({mode: 'bottom'})
})

app.on('window-all-closed', () => {
	app.quit()
})

app.on('quit', (evt, exit_code) => {
	console.log(Date(), ' -- Application exiting with exit code', exit_code);
})

// console.log('OS home folder: ', os.homedir())
