var gui = require('nw.gui')
var win = nw.Window.get()
var isShowWindow = true
var nodeApi = require('./asstes/js/utils')
var ajax = require('./asstes/js/newAjax')

gui.App.on('open', function(cmdline) {
  console.log(cmdline)
  gui.Window.get().show();//使得客户端显示在最前端
});

var tray = new nw.Tray({
  title: '智戎EDR',
  tooltip: '智戎EDR',
  icon: './asstes/img/edr-logo.png'
})
console.log(tray)

  var menu = new gui.Menu()
  menu.append(
    new gui.MenuItem({
      type: 'normal',
      label: '退出',
      click:() =>  {
        console.log('退出')
        win.close(true);
      }
    })
  )

  sessionStorage.setItem('trayItem', true)

  tray.menu = menu
  tray.on('click',
    function () {
      console.log('点击')
      win.show();
    }
  )

  win.on('close', function () {
    win.hide()
  })

  // window.onbeforeunload = () => {
  //   tray.remove()
  // }


