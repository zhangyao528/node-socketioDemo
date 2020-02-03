var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//记录所有已经登陆的用户
const users = [];

server.listen(3000, () => {
  console.log('服务器启动成功')
});

app.use(require('express').static('public'));

app.get('/', function (req, res) {
  res.redirect('/index.html');
});

io.on('connection', function (socket) {
  //监听登陆
  socket.on('login', data => {
    //判断data在user数组中存在，说明已经登陆了，不允许再次登陆
    var user = users.find(item => item.username === data.username);
    console.log(user)
    if (user) {
      //用户存在登陆失败
      socket.emit('loginError', { msg: '登陆失败' })
      console.log('登陆失败')
    } else {
      users.push(data)
      socket.emit('loginSuccess', data)
      console.log('登陆成功')

      //告诉所有用户，有人进聊天室，广播消息
      //socket.emit:告诉当前用户
      //io.emit 广播事件
      io.emit('addUser', data);

      //告诉所有用户，目前聊天室多少人
      io.emit('userlist', users);

      //把登陆成功的用户名和头像存储起来
      socket.username = data.username;
      socket.avatar = data.avatar;
    }
  })

  // 用户断开连接功能
  socket.on('disconnect', () => {
    // 当前用户从users中删除
    var idx = users.findIndex(item => item.username === socket.username);
    users.splice(idx, 1)

    //告诉所有人，有人离开了聊天室
    io.emit('delUser', {
      username: socket.username,
      avatar: socket.avatar
    })

    //告诉所有人，userlist需要更新
    io.emit('userlist', users)
  })

  //监听聊天的内容
  socket.on('sendMessage', data => {
    io.emit('reviceMessage', data);
  })

  //接收图片信息
  socket.on('sendImage', data => {
    io.emit('reviceImage', data);
  })
});