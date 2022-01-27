const fs = require('fs')
const path = require('path')
const request = require('request')
const cwdPath = process.cwd()
let relativePath = cwdPath + '/httpserver/'
let fileName = 'hahah'
let stream = fs.createWriteStream(path.join(relativePath + fileName))

request('http://192.168.1.90:8888/group1/M00/00/00/wKgBWmGt32WAYJvqAAADiuuy7Ew137.txt').pipe(stream).on('close', function(err) {
    console.log('文件[' + fileName + ']下载完毕')
})