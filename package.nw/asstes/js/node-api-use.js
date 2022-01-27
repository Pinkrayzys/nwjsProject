const fs = require('fs')
const os = require('os')
const find = require('find-process')
const current_process = require('current-processes')
const spawn = require('child_process').spawn
const exec = require('child_process').execFile // 打开第三方杀软exe
const path = require('path')
const execPath = path.dirname(process.execPath) //nw.exe运行地址
const cwdPath = process.cwd() // 应用地址
const wsi = require('wmic-sys-info')
// const request = require('request')
// const newAjax = require('./newAjax')
// const ajax = require('../js/axios/newAjax')

function showLetter(callback) {
    var wmicResult;
    var command = require('child_process').exec('wmic logicaldisk get caption', function(err, stdout, stderr) {
    // var command = wsi.getDiskDrive().then(function(stdout) {
        // if (err || stderr) {
        //     console.log("root path open failed" + err + stderr);
        //     return;
        // }

        wmicResult = stdout
        console.log(wmicResult)
    });
    command.stdin.end(); // stop the input pipe, in order to run in windows xp
    command.on('close', function(code) {
        const data = encodeURI(wmicResult)
            .replace(/%20/g, '')
            .replace(/%0D/g, '')
            .replace(/%0A%0A/g, '')
            .split('%0A')
            .filter(i => i !== 'Caption')
            .map(i => {
                return {
                    name: `本地磁盘 (${i})`,
                    path: i,

                    fullPath: i,
                    isDir: true,
                    disk: true
                }
            })
        callback(data);
    });
}

const filesToIgnore = ['.DS_Store', 'Thumbs.db', 'System Volume Information'];

function fileTree(folderPath, recursive = false) {
    // all of the error checking
    if (!folderPath) {
        return new Error('getFiles() was called without a folderPath argument');
    }
    if (typeof folderPath != 'string') {
        return new Error('getFiles() was called with an invalid folderPath argument; it must be of type String');
    }
    if (typeof recursive != 'boolean') {
        return new Error('getFiles() was called with an invalid recursive argument; it must be of type Boolean')
    }

    let files = []

    // Check if the file is readable.
    try {
        files = fs.readdirSync(folderPath)
    } catch (err) {
        console.error('no access!');
    }
    files = files
        // filter out filesToIgnore
        .filter(file => {
            return !filesToIgnore.includes(file)
        })

        // 系统文件.sys 读取的时候容易报错 故过滤掉
        .filter(file => {
            return !file.includes('.sys')
        })
        // 过滤掉文件夹 文件夹不显示
        .filter(file => {
            const fullPath = path.join(folderPath, file)
            const isDir = fs.statSync(fullPath).isDirectory()
            return isDir
        })
    // change each file to a full object
    .map(file => {
        const fileObj = {};
        fileObj.name = file;
        fileObj.path = folderPath;
        fileObj.fullPath = path.join(folderPath, file);
        fileObj.isDir = false // fs.statSync(fileObj.fullPath).isDirectory();
        try {
            fileObj.isDir = fs.statSync(fileObj.fullPath).isDirectory();
        } catch (err) {
            console.error('no dir!');
        }

        // if obj is not a folder; add an extension property
        if (!fileObj.isDir) {
            const ext = path.extname(fileObj.name);
            fileObj.ext = ext.substring(1, ext.length);
        }

        // if recursive = true, then create files property that recursively calls this function
        if (recursive && fileObj.isDir) {
            fileObj.files = fileTree(fileObj.fullPath, true);
        }

        return fileObj;
    })

    // sort files; give precedence to folders
    .sort((a, b) => {
        if (a.isDir && b.isDir) return (a.name < b.name) ? -1 : 1;
        else if (a.isDir) return -1;
        else if (b.isDir) return 1;
        else return (a.name < b.name) ? -1 : 1;
    });
    return files;
}

function find_process(params, cb) {
    find('name', params)
        .then(function(list) {
            cb(list.map(i => i.pid))
        })
}

function filter_pid_process(pid_list) {
    current_process.get((err, processes) => {
        nwjsProcesses = processes.filter(i => {
                return ~pid_list.indexOf(i.pid)
            })
            .map(i => {
                return {
                    cpu_percent: i.cpu,
                    memory_percent: i.mem.usage,
                    memory_usage: i.mem.virtual
                }
            })
            .reduce((pre, cur) => {
                return {
                    cpu_percent: pre.cpu_percent + pre.cpu_percent,
                    memory_percent: pre.memory_percent + pre.memory_percent,
                    memory_usage: pre.memory_usage + pre.memory_usage
                }
            })
    })
}
// find_process('nw.exe', filter_pid_process)

function node_readFile(path, cb) {
    fs.readFile(path, 'utf-8', (err, text) => {
        if (err) throw Error(err)
        cb(text)
    })
}

function openExe(url,callback) {
    var url = '/httpserver/httpserver.exe'
    // 1216 由于 exec 会发生返回的buffer 内存过大 系统卡死的问题
    // 所以替换通信方法 spawn
    spawn(cwdPath + url, ['httpserver'], {}, function(err, data) {
        if (err) {
            console.log(err);
            alert(err +  "\n" + '服务断开')
            sessionStorage.api_path = ""
        }

    })
    // require('child_process').exec('start ' + cwdPath + url, ['../win64'], {}, function (err, stdout, stderr) {
    //   console.log(1111)
    //   console.log(err)
    //   console.log(stdout)
    // })
}

function getMAC() {
    var zeroRegex = /(?:[0]{1,2}[:-]){5}[0]{1,2}/;
    var list = os.networkInterfaces();
    for (var key of Object.keys(list)) {
        if (!list[key]) continue;

        for (var part of list[key]) {
            if (zeroRegex.test(part.mac) === false && part.family === 'IPv4') {
                return { mac: part.mac, ip: part.address };
            }
        }
    }
}

function downUpdataFile(url, fileName) {
    // 存储 httpserver.exe 的同级文件夹
    const relativePath = cwdPath + '/httpserver/'
    const mypath = path.resolve(relativePath, fileName)
    // fs.writeFile(mypath, 'ahskdhaskh')
    // const writer = fs.createWriteStream(mypath)

    ajax.stream(url, { isDownload: true }).then(d => {
        // console.log(d);
        // d.pipe(writer)
        fs.writeFile(mypath, d)
    })


    // ajax.getStream('https://www.runoob.com/python/os-pipe.html', { isDownload: true }).then((res) => {
    //     console.log(res)
    //     res.pipe(stream)
    // })

    // 使用 requset 将远程中 url中的 数据  通过 pipe（管道） 存储到 stream 中
    // 监听 close  时间 下载完成输出
    // request('http://192.168.1.90:8888/group1/M00/00/00/wKgBWmGt32WAYJvqAAADiuuy7Ew137.txt', (err) => {
    //         console.log(err);
    //     })
    //     .pipe(stream).on('close', function(err) {
    //         console.log('文件[' + fileName + ']下载完毕')
    //     })
}