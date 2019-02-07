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


var count=1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "id" + count++;
  io.to(socket.id).emit('change name',name);

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(3000, function(){
  console.log('server on!');
});
