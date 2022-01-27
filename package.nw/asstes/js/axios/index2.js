var Axios = require('axios')

  // api_path = ''
  // var selectFile = cwdPath + '/httpserver/host.txt'
  // node_readFile(selectFile, (data) => {

  //   api_path =encodeURI(data).split('%')[0] + '/'
  //   sessionStorage.api_path = api_path
  // })

// var pyhthonApiTxt = cwdPath + '/apiPath.txt'
// node_readFile(pyhthonApiTxt, (data) => {
//   pyhthonApiPath =encodeURI(data).split('%')[0] + '/'
// })

  // // 请求拦截器
  // Axios.interceptors.request.use(
  //   config => {
  //     let params = config.params ||  config.data
  //     config.url = api_path + config.url
  //     // config = Object.assign({}, _.cloneDeep(config), { url: api_path + config.url})
  //     return config
  //   },

  //   error => {
  //     return Promise.reject(error)
  //   }
  // )

  // // 响应拦截器
  // Axios.interceptors.response.use(
  //   response => {
  //     const data = response.data || response

  //     // // 判断是流文件
  //     // if (typeof data === 'string') {
  //     //   // 获取流文件的名称
  //     //   // **如果获取不到？后端需要配置权限**
  //     //   const streamFileName =
  //     //     response.headers['content-disposition']
  //     //       .split(';')[1]
  //     //       .split('=')[1]
  //     //       .replace(/"/g, '')

  //     //   localStorage.setItem('streamFileName', streamFileName)
  //     // }

  //     return data
  //   },

  //   error => {
  //     return Promise.reject(error)
  //     // if (Axios.isCancel(error)) { // 取消请求的情况下，终止promise调用链
  //     //   return new Promise(() => { })
  //     // } else {
  //     //   return Promise.reject(error)
  //     // }
  //   }
  // )
// TODO: 查询为啥在html中配置拦截，不断刷新页面，会记录多个拦截器？

