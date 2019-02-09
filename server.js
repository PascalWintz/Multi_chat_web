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

var membersId = [];
var name={};
var socketId;
var membersIdList;
var whisperSocket;
var sender;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);

  //var name = "id" + count++;
  //var name = getElementById('name');
  //io.to(socket.id).emit('change name',name);


  socket.on('disconnect', function(){
    //console.log(membersId.indexOf(name));
    //  membersId.splice(membersId.indexOf(socket.id), 1);
    io.emit('login-info',"");
    io.emit('receive message',name[socket.id]+'님이 퇴장하셨습니다');
    delete name[socket.id];
    membersId=[];
    for(key in name){
      membersId.push(name[key]);
      console.log('삭제로 최신화 함');
      //membersId.splice(membersId.indexOf(name[key]),1);
      console.log(membersId);
      membersIdList=membersId.join('\n');
    }
      //console.log(name);
    //언더스코어 라이브러리라는게 있다는데 라이브러리 쓰지말고 하자
    //_.invert(hash)[socket.id];
    //delete membersInfo('asd');

    //console.log(socket);
    //for(var i=0;i<membersInfo.length;i++){
      //if(membersInfo[i]==socket.id){
      //  membersInfo.splice(i,1);
      //}
  //  }
    //console.log(membersInfo[0]);
    console.log(JSON.stringify(name));
      //  for(var i=0;i<Object.keys(name).length;i++){
      //      console.log('후');
      //    }
    console.log('user disconnected: ', socket.id);

    io.emit('login-info',"");

    //console.log(membersId);
  //  console.log(membersInfo.keys(socket.id));

    io.emit('login-info',membersIdList);

  });

  socket.on('send message', function(text){
    var msg = text; //name + ' : ' + text;
    //console.log(msg);
    var splitMsg=msg.split(" ");
    //console.log(splitMsg[1]);
    if(splitMsg[1]==('/w')){
        //msg.split(' ',3);
        //console.log('아이디는 : '+splitMsg[2]);
        for(key in name){
          if(splitMsg[2]===name[key]){
            //console.log('찾았다'+splitMsg);
            sender=splitMsg;
            whisperSocket=key;
            //console.log(whisperSocket);
            splitMsg[1]=splitMsg[1].replace('/w','님이 보낸 귓속말: ');
            reciever=splitMsg[2];
            splitMsg[2]="";
            splitMsg=splitMsg.join('');
            //console.log(splitMsg);
          for(var i=0;i<2;i++){
            if(i==0)
                io.to(`${whisperSocket}`).emit('receive message', splitMsg);
              if(i==1){
                //console.log(sender);
                sender[0]=reciever;
                sender[1]='님에게 보낸 귓속말: ';
                sender=sender.join('');
              //splitMsg[0]=reciever;
              //splitMsg[1]=splitMsg[1].replace('님이 보낸 귓속말: ','님에게 보낸 귓속말: ');
                //console.log(splitMsg);
                io.to(`${socket.id}`).emit('receive message', sender);
}
//io.to(`${socket.id}`).emit('receive message', splitMsg); 와
//io.to(`${whisperSocket}`).emit('receive message', splitMsg); 를 함께 쓰면
//안보내져서 어쩔수없이 이렇게 함
            }////if
          }/////////////////if
        }/////for

        //for(var i=0;i<membersId.length;i++){
        //  if(membersId[i]==splitMsg[2]){
        //    console.log('찾음');
        //    console.log(name[splitMsg[2]]);
        //  }
        //}
    }
    else {
      msg=msg.split(' ');
      //console.log(msg[0]);
      msg[0]+=': ';
      msg=msg.join('');
      console.log(msg);
      io.emit('receive message', msg);}
  });

  socket.on('login-info',function(clientId){
    //console.log(name);
    //name+=clientId;
    socketId=socket.id;
    //console.log(membersId);
    name[socketId]=clientId;
    membersId=[];
    for(key in name){
      membersId.push(name[key]);
      console.log('접속으로 최신화');
      console.log(membersId);
      membersIdList=membersId.join('\n');
    }
    //membersId.push(Object[name]);
    //console.log(JSONObject.keys());
/*
    function JSONtoString(object) {
    var results = [];
    *for (var property in object) {
        var value = object[property];
        if (value)
            results.push(property.toString() + ': ' + value);
        }

        return '{' + results.join(', ') + '}';
}*/
    //alert(JSON.stringify(name));
    console.log(JSON.stringify(name));
    //console.log(socket);
    //for(var i=0;i<Object.keys(name).length;i++){
        //console.log('kk');
      //  console.log();
      //}

    //membersInfo={name:socket.id};
    //count++;

    //console.log(name);
    //console.log(membersInfo);
    io.emit('login-info',membersIdList);

    io.emit('receive message', clientId+'님이 접속하셨습니다');
  });

});

http.listen(3000, function(){
  console.log('server on!');
});
