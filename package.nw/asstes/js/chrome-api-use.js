function cpu (cb) {
  chrome.system.cpu.getInfo(cb)
}

function memory (cb) {
  chrome.system.memory.getInfo(cb)
}

function storage (cb) {
  chrome.system.storage.getInfo(cb)
}

function getProcessInfo (cb) {
  chrome.processes.getProcessInfo([], true, cb)
}

// 获取文件绝对路径
// 之恶能选择文件夹，不能选中文件
function openDirectory (cb) {
  chrome.fileSystem.chooseEntry({ type: "openDirectory" }, function(Entry) {
    chrome.fileSystem.getDisplayPath(Entry, cb)
  })
}