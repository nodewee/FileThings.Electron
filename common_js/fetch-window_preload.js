'use strict'

//放弃注入 jQuery，有些网站会有兼容性问题，不适合。（例如微信公众号文章页面）


//引入所需的 electron 模块
const {ipcRenderer} = require('electron')
const {remote} = require('electron')

//在渲染器进程 (网页) 中。

// ipcRenderer.on('from-main', (event, arg) => {
//     console.log(event)
//     console.log(arg) // prints "pong"
// })


// 等页面完成加载之后
window.onload = function(){ 
  //发送页面 html 给 renderer 进程
  var node_html = document.getElementsByTagName("body")[0];
//   console.log(node_html.innerHTML);

    const msg_channel = 'reply-html_from-window_' + remote.getCurrentWindow().id;
//   ipcRenderer.sendSync('from-fetch', 'ping') //发送同步消息
    ipcRenderer.send(msg_channel, [window.location.href, node_html.innerHTML]) //发送异步消息

    console.log("send body html to crawler.")

}


console.log("inject js success.");