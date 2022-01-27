var  edrHeader =
    `<h3>
      <img src="../asstes/img/edr-logo.png"><span>智戎 Endpoint Detection Response v.202112</span>
    </h3>
    <div class="btnBox">
      <span @click="openSetUp()">
      <i class="iconfont edr-set-up-dot" style="font-size:20px;"></i>
      </span>
      <span @click="miniSizeWindow()">
        <i class="iconfont edr-2zuixiaohua-2"></i>
      </span>
        &nbsp;
      <span @click="closeWindow()">
        <i class="iconfont edr-guanbi"></i>
      </span>
    </div>`
  var  dom = document.getElementsByClassName('head')[0]
  dom.innerHTML = edrHeader