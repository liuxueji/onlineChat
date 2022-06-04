# onlineChat
#### 🐱‍🏍基于websocket实现的在线聊天项目

## 实现

### 创建项目并初始化

- 创建 `onlineChat`
- 执行 `npm init`

### 安装依赖并开启服务器

> 这里使用`express-ws`实现`webSocket`通信

- `npm i express express-ws`

- 开启`express`服务器

  ```
  const express = require('express')
  const app = express()
  const port = 3000
  
  app.use('/', function(req,res){
    console.log('hello');
  })
  
  app.listen(port, () => {
    console.log('server is running');
  })
  ```

  

### 实现两个聊天页面

设计思路：

- 顶部：显示对方名称
- 内容：显示聊天内容
- 底部：输入框和发送按钮

聊天内容：对方发送的信息显示在左侧，自己发送的信息显示在右侧

我是两个页面分开写（张飞、关羽），这样实现比较简单。

代码

```
  <div class="main">
    <div class="top">二哥</div>
    <div class="content" id="content">
      <div class="msg left">
        <img src="./guanyu1.png">
        <div>我是二哥</div>
      </div>
      <div class="msg right">
        <div>我是三弟</div>
        <img src="./zhangfei1.png">
      </div>
    </div>
    <div class="bottom">
      <input id="inp" placeholder="请输入内容" />
      <button class="sendBtn" onclick="sendBtn()">发送</button>
    </div>
  </div>
```

此时两个页面已经写好了

效果展示：

![image-20220602091036300](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220602091036300.png)

我们通过`express`提供的`static`获取两个页面

>通过 `Express` 内置的 `express.static` 可以方便地托管静态文件，例如`图片、CSS、JavaScript` 文件等。

```
app.use(express.static('public'))
app.use('/guanyu', express.static('public/guanyu.html'))
app.use('/zhangfei', express.static('public/zhangfei.html'))
```

### 实现数据传递

> 设计思路：用`服务器`将`客户端A`发送回来的数据，保存并转发给`客户端A`与`客户端B`，从而实现聊天功能，`客户端B`发送的数据也同理。

- 实现张飞向关羽发送数据

  - 服务器接收到张飞发送的数据
  - 服务器将数据发送给张飞，并存储数据
  - 将存储的张飞数据发送给关羽

- 代码

  `websocket.js`

  ```
  // zhangfei to zhangfei 简写，表示接收张飞数据，转发给张飞，并存储。张飞调用。下同
  router.ws('/ztz', ws => {
    ws.on('message', msg => {
      zhangfeiInfo.push(msg)
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
    }, 100)
  })
  ```

  `zhangfei.html`

  ```
  const ztz = new WebSocket('ws://localhost:3000/ztz')
  ztz.onopen = () => {}
  ztz.onmessage = (res) => content.innerHTML += rightMsg(res.data)
  
  function rightMsg(value) {
      var rightHtml = `
          <div class="msg right">
          <div>${value}</div>
          <img src="./zhangfei1.png">
          </div>
      `;
      return rightHtml;
  }
  
  
  function sendBtn(e) {
      let value = inp.value;
      ztz.send(value)
  }
  ```

  `guanyu.html`

  ```
  const ztg = new WebSocket('ws://127.0.0.1:3000/ztg')
  ztg.onopen = () => {}
  ztg.onmessage = res => content.innerHTML += leftMsgFn(res.data)
  
  let inp = document.getElementById('inp')
  
  function leftMsgFn(value) {
    var leftHtml = `
      <div class="msg left">
        <img src="./zhangfei1.png">
        <div>${value}</div>
      </div>
    `;
    return leftHtml;
  }
  ```

  到这里就实现了张飞发送数据给关羽

- 同理实现，关羽发送数据给张飞

- 效果展示

  ![onlineChat2](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/onlineChat2.gif)

> 注意：这里获取数据是通过定时器，定时检查服务器存放的数据，如果有数据，那就通过`send`发送给客户端，所以，定时器设置的时间越短，对方接收的信息延迟就越低。不过时间设置太短容易造成服务器崩溃。
