const express = require('express')
const app = express()
const port = 3000
const expressWs = require('express-ws')
const websocket = require('./websocket.js')
expressWs(app)

app.use('/guanyu', express.static('public/guanyu.html'))
app.use('/zhangfei', express.static('public/zhangfei.html'))
app.use('/', websocket)
app.use(express.static('public'))

app.listen(port, () => {
  console.log('server is running');
})