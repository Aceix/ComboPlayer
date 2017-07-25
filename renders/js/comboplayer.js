// import necessary modules
const $ = require('jquery')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mime = require('mime-types')
const {ipcRenderer} = require('electron')
const plyr = require('plyr')



let videoplayer = null
init()

// utility function to make a nav item active
function setNavItemActive(nav_item){
	$('#navhome').removeClass('active')
	$('#navdesktop').removeClass('active')
	$('#navdownloads').removeClass('active')
	$('#navvideos').removeClass('active')
	$('#navmusic').removeClass('active')
	$(nav_item).addClass('active')
}

// helper function to set page title
function setPageTitle(str){
	if (str instanceof String || typeof str === 'string') {
		$('#pagetitle').text(str)
	}
}

//function to prepare stuff
function init() {
	videoplayer = plyr.setup('#videoplayer')[0]
	videoplayer.on('setup', (e) => {
		videoplayer.poster('')
		// create preferencecs fikle for user-defined persistence
			videoplayer.setVolume(5)
		// ==============
	})
	videoplayer.on('ended', (evt) => {
		// seek back to start!!!
		videoplayer.seek(0)
	})
	videoplayer.on('click', (evt) => {
		//do nothnig
		evt.preventDefault()
	})
	videoplayer.on('dblclick', (evt) => {
		videoplayer.toggleFullscreen()
	})
}

// funtion to update directory contents view
// may include images
function updateDirectoryContentsView(list){
	if(list instanceof Array){
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
		$('#directorycontentsview').empty()
		let _header = $('<div>', {class: 'list-group-header'})
		_header.append($('<input>', {class: 'form-control', type: 'text', placeholder: 'Search for file...'}))
		$('#directorycontentsview').append(_header)
		list.forEach((val) => {
			_path = path.join(_path, val)
			
			if (String(mime.lookup(_path)).search('(video|audio)/.+') > -1) {
				let _tmp = $('<li>', {class: 'list-group-item', onclick: 'onDirectoryContentsViewItemClick(this)'}).append($('<div>', {class: 'media-body'}).append($(`<strong>${val}</strong>`)))
				$('#directorycontentsview').append(_tmp)
			}
		})
	}
	else{
		ipcRenderer.send('log', 'Non-Array type passed to function updateDirectoryContentsView()', true)
	}
}

function onDirectoryContentsViewItemClick(item){
	// console.log(item);
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
	_path = path.join(_path, item.innerText)
	// console.log('_path var:',_path)

	fs.stat(_path, (err, stats) => {
		if(err)
			return ipcRenderer.send('log', err, true)
		if (stats.isFile() && String(mime.lookup(_path)).search('(video|audio)/.+') != -1) {
			// loadFile(_path)
			// console.log('hey I must play', _path)
			console.log(mime.lookup(_path))
			videoplayer.source({
				type: (String(mime.lookup(_path)).search('video/.+') > -1) ? 'video' : 'audio',
				title: item.innerText,
				sources: [{
					src: _path,
					type: mime.lookup(_path)
				}]/*,
				tracks: [{
					kind:   'captions',
					label:  'English',
					srclang:'en',
					src:    '/path/to/captions.vtt',
					default: true
				}]*/
			})
			setPageTitle(item.innerText)
			videoplayer.seek(0)
			videoplayer.play()
		}
		else{
			ipcRenderer.send('dialog', {message: `File ${_path} not a supported file!\nLoad MIME types audio/* and video/*`, buttons: ['OK'], type: 'info'})
			// require('electron').dialog.showMessageBox({message: `File ${_path} not a supported file! Load MIME types audio/* and video/*`, buttons: ['OK'], type: info})
		}
	})
}

function onNavHomeClick(){
	try {
		setNavItemActive('#navhome')
		fs.access(os.homedir(), (err) => {
			if(err)
				return ipcRenderer.send('log', err, true)
			fs.readdir(os.homedir(), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		ipcRenderer.send('log', e)
	}
}

function onNavDesktopClick(){
	try {
		setNavItemActive('#navdesktop')
		fs.access(path.join(os.homedir(), 'Desktop'), (err) => {
			if(err)
				return ipcRenderer.send('log', err, true)
			fs.readdir(path.join(os.homedir(), 'Desktop'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		ipcRenderer.send('log', err)
	}
}

function onNavDownloadsClick(){
	try {
		setNavItemActive('#navdownloads')
		fs.access(path.join(os.homedir(), 'Downloads'), (err) => {
			if(err)
				return ipcRenderer.send('log', err, true)
			fs.readdir(path.join(os.homedir(), 'Downloads'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		ipcRenderer.send('log', err)
	}
}

function onNavVideosClick(){
	try {
		setNavItemActive('#navvideos')
		fs.access(path.join(os.homedir(), 'Videos'), (err) => {
			if(err)
				return ipcRenderer.send('log', err, true)
			fs.readdir(path.join(os.homedir(), 'Videos'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		ipcRenderer.send('log', err)
	}
}

function onNavMusicClick(){
	try {
		setNavItemActive('#navmusic')
		fs.access(path.join(os.homedir(), 'Music'), (err) => {
			if(err)
				return ipcRenderer.send('log', err, true)
			fs.readdir(path.join(os.homedir(), 'Music'), (err, files) => {
				updateDirectoryContentsView(files)
			})
		})
	} catch (err) {
		ipcRenderer.send('log', err)
	}
}

function onQuitButtonClick(){
	//Ensure you dispose the videoplayer
	videoplayer.destroy()
	ipcRenderer.send('appQuit')
}

function onMinimizeButtonClick(){
	ipcRenderer.send('mainwndMinimize')
}

function onHeaderDoubleClick(){
	ipcRenderer.send('mainwndMaximize')
}
