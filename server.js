var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var users = []
var connections = []
var rooms = {
  "111":{
    "sockets":[]
  }
}

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket){
  // When connected to the room, send the socket to sockets array
  // var index = rooms["111"]["sockets"].push(socket) - 1;
  rooms["111"]["sockets"].push(socket)
  // rooms["111"]["sockets"].push(socket)
  console.log('Connection: %s sockets connected', rooms["111"]["sockets"].length)
  io.emit('room info', "A user joined")

  //Disconnect
  socket.on('disconnect', function(){
    // When a user disconnect, remove it from the sockets list
    rooms["111"]["sockets"].splice(rooms["111"]["sockets"].indexOf(socket), 1)
    console.log('1 user disconnected, Connection: %s sockets connected', rooms["111"]["sockets"].length)
    // io.emit('room info', 'A user disconnected')
  })
  socket.on('chat message', function(msg){
    console.log('message:' + msg)
    io.emit('chat message', msg)
  })
})

http.listen(3000, function(){
  console.log('listen on *:3000')
})
