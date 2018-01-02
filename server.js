var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

http.listen(3000, function(){
  console.log('listen on *:3000')
})

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html')
})

// Chatroom

var users = []
var connections = []
var rooms = {
  "111":{
    "sockets":[]
  }
}

io.on('connection', function(socket){
  var addedUser = false

  // Chat message
  socket.on('new message', function(data){
    console.log('message:' + data)
    io.emit('new message', {
      username: socket.username,
      message: data
    })
  })

  socket.on('add user', function(username){
  // When connected to the room, send the socket to sockets array
  // var index = rooms["111"]["sockets"].push(socket) - 1;
    if (addedUser) return

    socket.username = username
    rooms["111"]["sockets"].push(socket)
    addedUser = true
    console.log('Connection: %s sockets connected', rooms["111"]["sockets"].length)
    socket.broadcast.emit('room info', {
      username: socket.username,
      numUsers: rooms["111"]["sockets"].length
    })
  })

  //Disconnect
  socket.on('disconnect', function(){
    // When a user disconnect, remove it from the sockets list
    if(addedUser) {
      rooms["111"]["sockets"].splice(rooms["111"]["sockets"].indexOf(socket), 1)
      console.log('1 user disconnected, Connection: %s sockets connected', rooms["111"]["sockets"].length)

      socket.broadcast.emit('room info', {
        username: socket.username,
        numUsers: rooms["111"]["sockets"].length
    })
  }
  })
})
