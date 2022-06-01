const express = require('express')
const expressWs = require('express-ws')
const router = express.Router()
expressWs(router)

let zhangfeiInfo = []
let guanyuInfo = []

// zhangfei to zhangfei 简写，表示接收张飞数据，转发给张飞，并存储。张飞调用。下同
router.ws('/ztz', ws => {
  ws.on('message', msg => {
    zhangfeiInfo.push(msg)
    ws.send(msg)
  })
})

router.ws('/gtg', ws => {
  ws.on('message', msg => {
    guanyuInfo.push(msg)
    ws.send(msg)
  })
})

// zhangfei to guanyu 简写，表示将张飞的数据，发送给关羽。关羽调用。下同
router.ws('/ztg', ws => {
  setInterval(() => {
    if (zhangfeiInfo.length > 0) {
      let msg = zhangfeiInfo[0]
      zhangfeiInfo.shift()
      ws.send(msg)
    }
  }, 500)
})

router.ws('/gtz', ws => {
  setInterval(() => {
    if (guanyuInfo.length > 0) {
      let msg = guanyuInfo[0]
      guanyuInfo.shift()
      ws.send(msg)
    }
  }, 500)
})
module.exports = router