var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

var membersInfo = {};
var membersId = [];
var name;
var count=0;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);

  //var name = "id" + count++;
  //var name = getElementById('name');
  //io.to(socket.id).emit('change name',name);


  socket.on('disconnect', function(){
    console.log(membersId.indexOf(name));
      membersId.splice(membersId.indexOf(socket.id), 1);
      //console.log(name);
    //언더스코어 라이브러리. 라이브러리는 되도록 안쓰려고 했는데
    //_.invert(hash)[socket.id];
    //delete membersInfo('asd');

    //console.log(socket);
    //for(var i=0;i<membersInfo.length;i++){
      //if(membersInfo[i]==socket.id){
      //  membersInfo.splice(i,1);
      //}
  //  }
    //console.log(membersInfo[0]);

    console.log('user disconnected: ', socket.id);

    io.emit('login-info',"");

    //console.log(membersId);
  //  console.log(membersInfo.keys(socket.id));

    io.emit('login-info',name);

  });

  socket.on('send message', function(text){
    var msg = text; //name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });

  socket.on('login-info',function(clientId){
    //console.log(name);
    name+=clientId;
    membersId.push(socket.id);
    //console.log(membersId);

    //membersInfo={name:socket.id};
    //count++;

    //console.log(name);
    //console.log(membersInfo);
    io.emit('login-info',clientId);

    io.emit('receive message', clientId+'님이 접속하셨습니다');
  });

});

http.listen(3000, function(){
  console.log('server on!');
});
