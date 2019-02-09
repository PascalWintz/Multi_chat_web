var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/sign-up',function(req, res){
  res.sendFile(__dirname + '/sign-up.html');
});

app.get('/chat',function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.get('/Images',function(req, res) {
  res.sendFile(__dirname+'/Images/kurzgesagt1920x1080.jpg');

});

var membersId = [];
var name={};
var socketId;
var membersIdList;
var whisperSocket;
var sender;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);

  socket.on('disconnect', function(){
    io.emit('login-info',"");
    io.emit('receive message',name[socket.id]+'님이 퇴장하셨습니다');
    delete name[socket.id];
    membersId=[];
    for(key in name){
      membersId.push(name[key]);
      console.log('삭제로 최신화 함');
      console.log('현재 접속자 : '+membersId);
      membersIdList=membersId.join('\n');
    }
    console.log(JSON.stringify(name));
    console.log('user disconnected: ', socket.id);

    io.emit('login-info',"");
    io.emit('login-info',membersIdList);

  });

  socket.on('send message', function(text){
    var msg = text;
    var splitMsg=msg.split(" ");
    if(splitMsg[1]==('/w')){
        for(key in name){
          if(splitMsg[2]===name[key]){
            sender=splitMsg;
            whisperSocket=key;
            splitMsg[1]=splitMsg[1].replace('/w','님이 보낸 귓속말: ');
            reciever=splitMsg[2];
            splitMsg[2]="";
            splitMsg=splitMsg.join('');
          for(var i=0;i<2;i++){
            if(i==0)
                io.to(`${whisperSocket}`).emit('receive message', splitMsg);
              if(i==1){
                sender[0]=reciever;
                sender[1]='님에게 보낸 귓속말: ';
                sender=sender.join('');
                io.to(`${socket.id}`).emit('receive message', sender);
}
//io.to(`${socket.id}`).emit('receive message', splitMsg); 와
//io.to(`${whisperSocket}`).emit('receive message', splitMsg); 를 함께 쓰면
//안보내져서 어쩔수없이 이렇게 함
            }////if
          }/////////////////if
        }/////for
    }
    else {
      msg=msg.split(' ');
      msg[0]+=': ';
      msg=msg.join('');
      console.log(msg);
      io.emit('receive message', msg);}
  });

  socket.on('login-info',function(clientId){
    socketId=socket.id;
    name[socketId]=clientId;
    membersId=[];
    for(key in name){
      membersId.push(name[key]);
      console.log('접속으로 최신화');
      console.log('현재 접속자 : '+membersId);
      membersIdList=membersId.join('\n');
    }
    console.log(JSON.stringify(name));
    io.emit('login-info',membersIdList);

    io.emit('receive message', clientId+'님이 접속하셨습니다');
  });

});

http.listen(3000, function(){
  console.log('server on!');
});
