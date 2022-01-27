var Axios =  require('axios')
const apiPath = 'http://127.0.0.1:9999/'

module.exports = {
  get (Interface, requestData = {}) {
    return new Promise((resolve, reject) => {
      Axios.get(Interface, {
        params: requestData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(res => {
          resolve(res)
        }).catch(err => {
          console.log(err);
          reject(err)
        })
    })
  },

  blob (Interface, requestData = {}) {
    const configOri = {
      params: requestData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      responseType: 'blob'
    }
    return new Promise((resolve, reject) => {
      Axios.get(Interface, configOri)
        .then(r => {
          resolve(window.URL.createObjectURL(new Blob([r])))
        }).catch(err => {
          reject(err)
        })
    })
  },


  getStream (Interface, requestData = {}) {
    return new Promise(resolve => {
      Axios.get(Interface, {
        responseType: 'stream'
      })
        .then(res => {
          resolve(res)
        }).catch(res => {
          resolve(res)
        })
    })
  },

  stream (Interface, requestData = {}) {
    return new Promise((resolve, reject) => {
      Axios.get(Interface, {
        params: requestData,
        responseType: 'stream'
      })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
    })
  },


  post (Interface, requestData = {}) {
    return new Promise((resolve, reject) => {
      Axios.post(Interface, requestData, {
        transformRequest: [function (requestData) { // 转换数据格式，有待测试传送文件的方式时候同样可行。
          let ret = ''
          for (const it in requestData) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(requestData[it]) + '&'
          }
          ret = ret.slice(0, ret.length - 1)
          return ret
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  },

  upload (Interface, formData, config) {
    return new Promise((resolve, reject) => {
      Axios.post(Interface, formData, config)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  }
}
