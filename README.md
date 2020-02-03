# node-socketioDemo
---

#### **功能点**
1. 发送消息
2. 发送图片
3. 发送表情

---

socket.io基于express的安装：**npm install socket.io express**

表情插件（让文本框或div具有插入表情功能）：**jQuery-emoji**

---


下载代码后，需要先输入：**npm install socket.io express**

然后再运行：**node app.js**

本地运行：http://localhost:3000/


---
socket.io主要用到的方法

```
//连接
io.on('connection',function(socket){
    //监听登陆
    socket.on('login', data => {})
    
    // 用户断开连接功能
    socket.on('disconnect', () => {})
    
    //告诉所有用户，有人进聊天室，广播消息
    //socket.emit:告诉当前用户
    //io.emit 广播事件
    socket.emit('xxx', data);
    io.emit('xxx', data);
    
    //接收广播事件
    socket.on('xxx',() => {})
})

```

**app.js和index.js是不断的进行广播和接收**

聊天室的输入框不能使用textarea，因为表情在textarea中会显示成符号，所以换成了div框，在div框中写入属性contenteditable

```
<div class="text textarea-box" id="content" contenteditable></div>
```

在index.js文件中需要初始化jquery-emoji插件
注意：该插件还依赖其他插件jquery-mCustomScrollbar

```
$('.face').click(function(){
    $("#content").emoji({
        //设置触发表情的按钮
        button: ".face",
        showTab: false,
        animation: 'slide',
        position: 'topRight',
        icons: [{
            name: "QQ表情",
            path: "lib/jquery-emoji/img/qq/",
            maxNum: 91,
            excludeNums: [41, 45, 54],
            file: ".gif"
        }]
    });
});
```
