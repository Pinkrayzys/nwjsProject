

function obj2url (obj) {
  obj = Object.assign(obj)

  var finnalStr = ''
  var keys = Object.getOwnPropertyNames(obj)

  for (let ind = 0; ind < keys.length; ind++) {
    const key = keys[ind];
    finnalStr += key + '=' + obj[key] + '&'
  }

  return finnalStr.slice(0, finnalStr.length - 1)
}

var path = require('path')
var fs = require('fs')
var execPath = path.dirname(process.execPath)
function ajax_get (url, params, cb) {
  // let selectFile = execPath + '/win64/host.txt'
  // var api_path
  // node_readFile(selectFile, (err, data) => {
  //   if (err) {
  //   }
  //   else {
  //     api_path = data
  //   }
  // })
  var xmlhttp
  if (window.XMLHttpRequest) {
    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp = new XMLHttpRequest()
  }
  else {
    // IE6, IE5 浏览器执行代码
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
  }

  if (params) {
    var finnalurl = api_path + url + '?' + obj2url(params)
  } else {
    var finnalurl = api_path + url
  }
  console.log(finnalurl);
  xmlhttp.open("GET", finnalurl, true)
  xmlhttp.send()
  console.log(xmlhttp)

  xmlhttp.onreadystatechange = function (res) {
    if (xmlhttp.status == 200) {
      console.log(xmlhttp.responseText)
    } else {
      console.log('Error:' + xmlhttp.responseText)
    }
  }
}

function ajax_post (url, params, cb) {
  var xmlhttp
  if (window.XMLHttpRequest) {
    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp = new XMLHttpRequest()
  }
  else {
    // IE6, IE5 浏览器执行代码
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      alert(xmlhttp.responseText)
    } else {
      alert('Error:' + xmlhttp.responseText)
    }
  }
  var finnalurl = api_path + url
  xmlhttp.open("POST", finnalurl, true)
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(params);
}