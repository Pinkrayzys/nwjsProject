// bytes 2 Mb
function bytes2M(params) {
  return `${Math.round(params / 1024 / 1024 * 100) / 100}MB`
}

// 二维对象{k: {k: ''}, k2: {k: ''}} 变
// 一维数组对象 [{k: ''}, {k: ''}]
function obj2arrObj(obj, tarKeys) {
  if (!obj) {
    return []
  }

  var arr = []
  var keys = Object.getOwnPropertyNames(obj)
  tarKeys = tarKeys || []

  for (var ind = 0;ind < keys.length;ind++) {
    var key = keys[ind]
    var element = obj[key]

    var itemObj = {}
    for (var tarInd = 0;tarInd < tarKeys.length;tarInd++) {
      var tarKey = tarKeys[tarInd]

      itemObj[tarKey] = element[tarKey]
    }
    arr.push(tarKeys.length ? itemObj : element)
  }

  return arr
}

function stopScan () {
  ajax.get('stop')
    .then(res => {
      console.log(res)

    })
    .catch(err => {
      console.log(err);
    })
}

function miniSizeWindow () {
  var win = nw.Window.get();
  win.minimize()
}

function closeWindow () {
  var win = nw.Window.get();
  win.hide();
}

// 全局查杀
function scanFull () {
  return ajax.post('scan', { mode: 'full' })
}

// 获取进度
function getProgress() {
  return ajax.get('progress', {
    time: new Date().getTime()
  })
}

// 获取结果
function getResult() {
  return ajax.get('result')
}

// 给后端提交结果
function funct(val) {
  ajax.post('sync_task_detail/', {
    ip_address: getMAC().ip,
    username: 'user-1',
    terminal_id: getMAC().mac, // 郑炜说 1203 terminal_id就是本地的Mac地址
    file_list: JSON.stringify(val.data),
    total: val.data.length,
    update_res: ''
  }).then(res => {
  })
}

// 获取远程任务的请求
function getSwitch(params) {
  return ajax.get('remote_control/', {
    terminal_id: getMAC().mac
  })
}


//  启动本地远程查杀
function task_list (params) {
  scanFull().then(() => {
    let timer = setInterval(() => {
      getProgress().then(progress => {
        if (progress.data === '扫描结束') {
          clearInterval(timer)
          getResult().then(result => {
            let tabObj = {}
            let d = result.data
            SendMalicious(JSON.parse(JSON.stringify(result.data)))
            transmissionResult(result)
          })
        }
      })
    }, 1000);
  })
}

// 获取后台监听任务reslut2
function backstageResult(params) {
  ajax.get('result2').then((res) => {
    if (res.length) {
      transmissionResult(res)
      SendMalicious(JSON.parse(JSON.stringify(res)))
      if (localStorage.AutomaticCleaning && Boolean(Number(localStorage.AutomaticCleaning))) {
        clearAll(res)
      }
    }
  })
}

function request_switch_list () {
  // 定时器获 定时获取 保护天数
  let nowTime = new Date()
  localStorage.setItem('protectionDays', dayjs(nowTime).diff(localStorage.startDay, 'days'))

  getSwitch().then(r => {
      const openScan = r.data.remote_killing // 方便与localStorage 比较

      if (openScan) { // 当远程任务开启了，
        if (sessionStorage.scaning === '1') { // 本地已经知道了 当前有任务在开启查杀了
          // 啥也不干
        } else { // 本地不知道 当前没有开启后台查杀任务
          sessionStorage.scaning = '1'

          // 当前是否有 用户的 查杀任务正在进行中
          if (!sessionStorage.currentScanType) {
            // 如果当前 没有用户自定义开启的任务 则开启 后台全盘查杀
            task_list()
          }
        }
      } else { // 远程任务结束啦
        sessionStorage.scaning = '0'
      }
      setTimeout(() => {
        request_switch_list()
        getVirusVs()
        backstageResult() // result2 打开
        getUdisk() // 监听upan
      }, 3000)
    })
}

function changeStatus(val) {
  ajax.post('change_status/', {
    terminal_id: getMAC().mac, // 郑炜说 1203 terminal_id就是本地的Mac地址
    status: val // 0 是关闭 1 是开启
  })
  .then(res => {
  })
}

function SendMalicious(val) {
  if(val.length){
    let item = val[0]
    fs.readFile(item.file_path,(err, file) => {
      ajax.post('upload_file/', {
        terminal_id: getMAC().mac,
        file_name: item.fileName,
        file_md5: item.md5,
        file: file
      })
      .then(() => {
        val.shift()
        localStorage.uploadFile = JSON.stringify(val)
        if (val.length) {
          SendMalicious(val)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    })
  }
}

function transmissionResult(val, update_res) {
  ajax.post('sync_task_detail/', {
    ip_address: getMAC().ip,
    username: 'user-1',
    terminal_id: getMAC().mac, // 郑炜说 1203 terminal_id就是本地的Mac地址
    file_list: JSON.stringify(val),
    total: this.sacnTotal,
    update_res: update_res ? update_res : ''
  }).then(res => {
  })
}


function getVirusVs() {
    ajax.get('update_virus_lib/', {
      terminal_id: getMAC().mac,
      if_download: 1 ,  // 1  下载  0  不下载
    })
      .then(res => {
        localStorage.setItem('VirusVs', res.data.virus_version)
        // localStorage.VirusVs = res.data.virus_version + Math.random()
        if (res.message !== '已是最新版本！') {
          downUpdataFile('http://117.186.16.165:18010/' + res.data.virus_url, 'upgradeVirusFile.rp')
        }
      })
      .catch(err => {

      })
  }

// 将查找出来的恶意文件传输给后端
function confirm(th, type) {
  let str = ''
  switch (type) {
    case 0:
      str = '客户端服务启动失败，请重启客户端。'
      break;
    case 1:
        str = '客户端试用已到期, 请购买正版解锁更多功能'
        break;
    case 2:
      str = '5555'
      break;

    default:
      break;
  }
  th.$confirm(str, '提示', {
    confirmButtonText: '确定',
    modal: false
  })
  .then(()=> {
  })
  .catch(err => {
  })
}


// 启用 查杀功能
function clearAll(data, type) {
  if(data) {
    let pathArr = []
    data.forEach((i, j) => {
      if (type === 'isolate') {
        pathArr.push(i.new_path)
      } else if (type === 'whitelist') {
        pathArr.push(i.value)
      } else {
        pathArr.push(i.file_path)
      }
    })

    ajax.post('delete',{
      paths: pathArr.join(',')
    }).then((res) => {
      if (Array.isArray(res.data)) {
        let paths = []
        res.data.forEach((res) => {
          paths.push(res.path)
        })
        let resdata = JSON.parse(JSON.stringify(data))
        let undel = resdata.filter(item => {
          return !paths.includes(item.file_path)
        })
        transmissionResult(undel, 'yes')
      }
      // 通过res.data.path过滤
    })
  }
}

// 监听后台进程的变化
function riskProcess() {
  ajax.get('result3').then((res) => {
    if (res.process_name) {
        MyNotification(res.process_name, res.process_id)
    } else {
      // 递归请求result3
      setTimeout(() => {
        riskProcess() //
      }, 3000)
    }
  })
}

// 自定义进程拦截弹窗提示
function MyNotification(name, id) {
  // var gui = require('nw.gui')
  // // var win = gui.Window.get()
  // gui.Window.open('../../page/Notification.html?name=' + name + '&id=' + id, {
  //   position: 'center',
  //   width: 500,
  //   height: 300,
  //   focus:true,
  //   frame: false,
  //   id: '1'
  // }, function(new_win) {
  //   console.log(new_win)
  //   new_win.on('close', function() {
  //     console.log('New window is close');
  //     new_win.close()
  //   });
  // })

  // 0120 改用 notification
  var notification = new Notification("检测到恶意进程", {
    dir: "auto",
    lang: "zh-CN",
    tag: "riskTag",
    icon: './asstes/img/noti.png',
    renotify: false,
    body: name + '正在运行, 点击进行阻止'
  });
  notification.onclick = function() {
    ajax.post('kill', {
      pids: id
    }).then(() => {
    })
    .catch(err => {
    })
    notification.close();
    riskProcess()
  };
  notification.onclose = function() {
    riskProcess()
  }
}
function getUdisk() {
  ajax.get('udisk').then((res) => {
    if (res.length) {
      // 获得的恶意 进程名称
        res.forEach((item) => {
          if(item.action === 'insert') {
            // 0118 待解决 传 item path 过不去的问题 猜想可能是格式不对
            openUdiskDailog(item.path)
          } else {
            removeUdiskDailog(item.path)
          }
        })
    } else {
    }
  })
}
function openUdiskDailog(name) {
  // var gui = require('nw.gui')
  // // var win = gui.Window.get()
  // gui.Window.open('../../page/UdiskDailog.html?name=' + name, {
  //   position: 'center',
  //   width: 500,
  //   height: 300,
  //   focus:true,
  //   frame: false,
  //   resizable: false,
  //   id: '2'
  // }, function(new_win) {

  // })
  var notification = new Notification("检测到新U盘介质", {
      dir: "auto",
      lang: "zh-CN",
      tag: "diskTag",
      icon: './asstes/img/udisk.png',
      renotify: false,
      body: name + ' 点击进行检测'
    });
    notification.onclick = function() {
      ajax.post('scan', {
        paths: name,
        mode: 'paths'
      })
      .then(res => {
        sessionStorage.currentScanType = 'paths'
        window.location.href = '../page/ScanProgress.html' + '?mode=paths'
      })
      .catch(() => {
        getUdisk()
      })
    };
    notification.onclose = function() {
      getUdisk()
    }
}

function removeUdiskDailog(name) {
  var notification = new Notification("U盘弹出", {
      dir: "auto",
      lang: "zh-CN",
      tag: "diskTagremve",
      icon: './asstes/img/udisk.png',
      renotify: false,
      body: name + '  已安全弹出'
    });
    setTimeout(() => {
      notification.close();
    }, 3000)
  }





