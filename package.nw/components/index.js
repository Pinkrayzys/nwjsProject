
module.exports = {
  edrhead: {
    data: function () {
      return {
        systemName: localStorage.systemName || 'EDR',
      }
    },
    template: `
      <div class="head">
        <h3 v-cloak>
          <img src="../asstes/img/edr-logo.png"><span v-cloak>{{systemName}}</span>
        </h3>
        <div>
          <span onclick="miniSizeWindow()">
            <i class="iconfont edr-2zuixiaohua-2"></i>
          </span>
            &nbsp;
          <span onclick="closeWindow()">
            <i class="iconfont edr-guanbi"></i>
          </span>
        </div>
      </div>`,
    methods: {
      miniSizeWindow() {
        console.log(999)
        // var win = nw.Window.get();
        // win.minimize()
        miniSizeWindow()
      },
      closeWindow() {
        // var win = nw.Window.get();
        // win.hide();
      }
    },
  },
  edrfoot: {
    props: ['paths'],
    data: function () {
      return {
        edition: localStorage.VirusVs || 'virus-vision-1.0'
      }
    },
    mounted: function() {
      console.log(111, this.paths)
    },
    template: `
      <div class="footer">
      <span>病毒库版本: {{edition}}<a :href="paths" target="_self" class="textBtn">检查更新</a></span>
        <span class="textBtn setUpBtn">
        <a :href="paths" target="_self" class="textBtn">
        <i class="iconfont edr-set-up-dot" style="font-size: 20px;color:#50B19A"></i>
        </a>
        </span>
      </div>`

  }
}

// let app = {
//   edrHeader: {
//     data: function () {
//       return {
//         systemName: localStorage.systemName || 'EDR',
//       }
//     },
//     methods: {
//       miniSizeWindow() {
//         miniSizeWindow()
//       },
//       closeWindow() {
//         closeWindow()
//       }
//     },
//     template: '<div class="head"><h3 v-cloak> <img src="../asstes/img/edr-logo.png"><span v-cloak>{{systemName}}</span></h3><div><span @click="miniSizeWindow"><i class="iconfont edr-2zuixiaohua-2"></i></span>&nbsp;<span @click="closeWindow"><i class="iconfont edr-guanbi"></i></span></div></div>'
//   }
// }
// module.exports = app