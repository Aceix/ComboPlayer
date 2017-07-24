const os = require('os')
const fs = require('fs')
const path = require('path')
const url = require('url')
const {app, BrowserWindow, dialog} = require('electron')

let main_window


// utility function to log happeneings
const _log = function(e, disp) {
	console.error(e);
	fs.access(os.tmpdir(), fs.constants.W_OK | fs.constants.R_OK, (err) => {
		if(err)
			return console.error(err)
		let _logfile = path.join(os.tmpdir(), 'comboplayerjs-errorlog.txt')
		fs.appendFile(_logfile, Date() + ' ::: ' + String(e), (err) => {
			console.error(err);
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
		width: 1024,
		height: 300,
		minWidth: 800,
		minHeight: 280,
		title: 'Combo Player',
		show: false,
		frame: false,
		icon: ''
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

console.log('OS home folder: ', os.homedir())

module.exports._log = _log
module.exports.main_window = main_window
module.exports.application = app
