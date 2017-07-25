const path = require('path')
const os = require('os')
const fs = require('fs')

let test_file_path = path.join(os.homedir(), 'Desktop', 'Folder', 'test.txt')

fs.appendFile(test_file_path, 'test\n', (err) => {
	if (err) {
		// console.log(err.code)
		if (err.code == 'ENOENT') {
			let folder_path = test_file_path.slice(0,test_file_path.lastIndexOf('/'))
		console.log(folder_path)
			fs.mkdir(folder_path, (err) => {
				if (err) {
					return console.log(err)
				}
				fs.appendFile(test_file_path, 'test\n', (err) => {
					if(err)
						console.log(err)
				})
			})
		}
	}
})
// console.log(test_file_path)
