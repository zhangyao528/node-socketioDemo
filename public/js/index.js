/**
 * 聊天室的主要功能
 */

/**
 * 1. 连接socketio服务
 */
var socket = io('http://localhost:3000/');
var username, avatar;

/**
 * 2.选择头像
 */
$('#login_avatar li').click(function () {
    $(this).addClass('now').siblings().removeClass('now');
})

//登陆事件
$('#loginBtn').click(function () {
    var username = $('#username').val().trim();
    if (!username) {
        alert("请输入用户名")
        return
    }
    //获取用户头像
    var avatar = $('#login_avatar li.now img').attr('src')
    
    //需要告诉socket.io服务，登陆
    socket.emit('login', {
        username: username,
        avatar: avatar
    })
})

//监听登陆失败的请求
socket.on('loginError', data => {
    alert('登陆失败')
})

//监听登陆成功的请求
socket.on('loginSuccess', data => {
    //需要显示聊天窗口，隐藏登陆窗口
    $('.login_box').fadeOut();
    $('.container').fadeIn();
    //设置个人信息
    $('.avatar_url').attr('src', data.avatar);
    $('.info .username').text(data.username);
    username = data.username;
    avatar = data.avatar;
})

//监听新增用户
socket.on('addUser', data => {
    //添加一条系统消息
    $('.box-bd').append(`
        <div class="system">
            <p class="message_system">
                <span class="content">${data.username}加入群聊了</span>
            </p>
        </div>
    `)
    scrollIntoView();
})

//监听用户列表
socket.on('userlist', data => {
    $('.user-list ul').html('');
    data.forEach(item => {
        //userlist中的数据动态渲染
        $('.user-list ul').append(`
            <li class="user">
                <div class="avatar">
                    <img src="${item.avatar}" alt="">
                </div>
                <div class="name">${item.username}</div>
            </li>
        `)
    });

    $('#userCount').text(data.length);
})

//监听用户离开
socket.on('delUser', data => {
    //添加一条系统消息
    $('.box-bd').append(`
        <div class="system">
            <p class="message_system">
                <span class="content">${data.username}离开群聊</span>
            </p>
        </div>
    `)
    scrollIntoView();
})

//发送聊天内容
$('.btn-send').click(function () {
    var content = $('#content').html()
    $('#content').html('')
    if (!content) {
        return alert('请输入内容')
    }

    //发送服务器
    socket.emit('sendMessage', {
        msg: content,
        username: username,
        avatar: avatar
    })
})

//监听聊天的消息
socket.on('reviceMessage', data => {
    //把接收的消息显示到聊天窗口中
    if(data.username === username){
        //自己的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="my message">
                    <img class="avatar imgMessage" src="${data.avatar}" alt="">
                    <div class="content">
                        <div class="bubble">
                            <div class="bubble_cont">${data.msg}</div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }else{
        //别人的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="other message">
                    <img class="avatar imgMessage" src="${data.avatar}" alt="">
                    <div class="content">
                        <div class="nickname">${data.username}</div>
                        <div class="bubble">
                            <div class="bubble_cont">${data.msg}</div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
    scrollIntoView();
})

//滚动到当前元素底部
function scrollIntoView(){
    $('.box-bd').children(':last').get(0).scrollIntoView(false);
}

//发送图片功能
$('#file').change(function(){
    console.log(333)
    var file = this.files[0];

    //需要把这个文件发送到服务器，借助H5新增的fileReader
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = function(){
        console.log(fr.result);
        socket.emit('sendImage',{
            username:username,
            avatar:avatar,
            img:fr.result
        });
    }
})

//监听图片聊天信息
socket.on('reviceImage', data => {
    //把接收的消息显示到聊天窗口中
    if(data.username === username){
        //自己的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="my message">
                    <img class="avatar imgMessage" src="${data.avatar}" alt="">
                    <div class="content">
                        <div class="bubble">
                            <div class="bubble_cont">
                                <img class="fileImage" src="${data.img}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }else{
        //别人的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="other message">
                    <img class="avatar imgMessage" src="${data.avatar}" alt="">
                    <div class="content">
                        <div class="nickname">${data.username}</div>
                        <div class="bubble">
                            <div class="bubble_cont">
                            <img class="fileImage" src="${data.img}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    //等待图片加载完成再滚动
    $('.box-bd img:last').load(function(){
        scrollIntoView();
    })
})

//初始化jquery-emoji插件
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

/*$("#content").emoji({
    //设置触发表情的按钮
    button: "#face2",
    showTab: false,
    animation: 'slide',
    position: 'topLeft',
    icons: [{
        name: "QQ表情",
        path: "lib/jquery-emoji/img/qq/",
        maxNum: 91,
        excludeNums: [41, 45, 54],
        file: ".gif"
    }]
});*/
