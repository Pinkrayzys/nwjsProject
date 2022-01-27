const axios = require('axios')

const stream = (Interface, requestData = {}) => {
  return new Promise((resolve, reject) => {
    axios.get(Interface, {
      params: requestData,
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => {
      resolve(res.data)
    })
    .catch(error => {
      reject(error)
    })
  })
}

const path = require("path");
const fs = require("fs");
const filePath = "./"
const mypath = path.resolve(filePath, 'jjjjj.txt')
const writer = fs.createWriteStream(mypath)

stream('https://tieba.baidu.com/index.html').then(d => {
  d.pipe(writer)
})