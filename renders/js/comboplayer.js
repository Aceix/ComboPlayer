// import necessary modules
const $ = require('jquery')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mime = require('mime-types')
const _log = require(path.join(__dirname, '..', 'main.js'))._log;
const main_window = require(path.join(__dirname, '..', 'main.js')).main_window;
const application = require(path.join(__dirname, '..', 'main.js')).application;


// utility function to make a nav item active
function setNavItemActive(nav_item){
	$('#navhome').removeClass('active')
	$('#navdesktop').removeClass('active')
	$('#navdownloads').removeClass('active')
	$('#navvideos').removeClass('active')
	$('#navmusic').removeClass('active')
	$(nav_item).addClass('active')
}

// funtion to update directory contents view
// may include images
function updateDirectoryContentsView(list){
	if(list instanceof Array){
		$('#directorycontentsview').empty()
		let _header = $('<div>', {class: 'list-group-header'})
		_header.append($('<input>', {class: 'form-control', type: 'text', placeholder: 'Search for file...'}))
		$('#directorycontentsview').append(_header)
		// let buf = new Buffer(1024)
		// let pos = Int(0)
		list.forEach((val) => {
			let _tmp = $('<li>', {class: 'list-group-item', onclick: 'onDirectoryContentsViewItemClick(this)'}).append($('<div>', {class: 'media-body'}).append($(`<strong>${val}</strong>`)))
			$('#directorycontentsview').append(_tmp)
			// pos = buf.write('', pos, undefined, 'utf8')
		})
	}
	else{
		_log('Non-Array type passed to function updateDirectoryContentsView()', true)
	}
}

function onDirectoryContentsViewItemClick(item){
	console.log(item);
	let _path = ''
	if($('#navhome').hasClass('active'))
		_path = os.homedir()
	if($('#navdesktop').hasClass('active'))
		_path = path.join(os.homedir(), 'Desktop')
	if($('#navdownloads').hasClass('active'))
		_path = path.join(os.homedir(), 'Downloads')
	if($('#navvideos').hasClass('active'))
		_path = path.join(os.homedir(), 'Videos')
	if($('#navmusic').hasClass('active'))
		_path = path.join(os.homedir(), 'Music')
	_path = path.join(_path, item.innerText).slice(0,-1)
	console.log('_path var:',_path)

	fs.stat(_path, (err, stats) => {
		if(err)
			return _log(err, true)
		if (stats.isFile() && mime.lookup(_path).search('(video|audio)/.+') != -1) {
			// loadFile(_path)
		}
		else{
			require('electron').dialog.showMessageBox({message: `File ${_path} not a supported file! Load MIME types audio/* and video/*`, buttons: ['OK'], type: info})
		}
	})
}

function onNavHomeClick(){
	try {
		setNavItemActive('#navhome')
		fs.access(os.homedir(), (err) => {
			if(err)
				return _log(err, true)
			fs.readdir(os.homedir(), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		_log(e)
	}
}

function onNavDesktopClick(){
	try {
		setNavItemActive('#navdesktop')
		fs.access(path.join(os.homedir(), 'Desktop'), (err) => {
			if(err)
				return _log(err, true)
			fs.readdir(path.join(os.homedir(), 'Desktop'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		_log(err)
	}
}

function onNavDownloadsClick(){
	try {
		setNavItemActive('#navdownloads')
		fs.access(path.join(os.homedir(), 'Downloads'), (err) => {
			if(err)
				return _log(err, true)
			fs.readdir(path.join(os.homedir(), 'Downloads'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		_log(err)
	}
}

function onNavVideosClick(){
	try {
		setNavItemActive('#navvideos')
		fs.access(path.join(os.homedir(), 'Videos'), (err) => {
			if(err)
				return _log(err, true)
			fs.readdir(path.join(os.homedir(), 'Videos'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		_log(err)
	}
}

function onNavMusicClick(){
	try {
		setNavItemActive('#navmusic')
		fs.access(path.join(os.homedir(), 'Music'), (err) => {
			if(err)
				return _log(err, true)
			fs.readdir(path.join(os.homedir(), 'Music'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		_log(err)
	}
}

function onQuitButtonClick(){
	//Ensure you dispose the videoplayer
	application.quit(0)
}

function onMinimizeButtonClick(){
	main_window.minimize()
}
