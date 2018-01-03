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
var rooms = {
  "111": {
    "sockets":[]
  }
}

io.on('connection', function(socket){
  var addedUser = false
  var isRoomExist = false

  // handle room choosing and joining
  socket.on('choose room', function(roomIdInput){
    console.log(`The room id is ${roomIdInput}.`)
    // Check if roomIdInput exist, if so, join that room
    if(typeof rooms[roomIdInput] !== "undefined") {
      isRoomExist = true
      socket.room = roomIdInput
      socket.join(roomIdInput)
    }

    // If room doesn't exist, open a new room.
    else {
      //TODO: question here, how to add a variable to object
      // var newRoom = {
      //   `${roomIdInput}`: {
      //     "sockets": []
      //   }
      // }
      rooms[roomIdInput] = {"sockets": []}
      console.log(rooms)
      isRoomExist = true
      socket.room = roomIdInput
      socket.join(roomIdInput)
    }
  })

  // Chat message
  socket.on('new message', function(data){
    console.log('message:' + data)
    io.in(socket.room).emit('new message', {
      username: socket.username,
      message: data
    })
  })

  // Add user to the room they choose
  socket.on('add user', function(username){
    // If either current user added or the room doesn't exist, user cannot join
    if (addedUser || !isRoomExist) return

    // When connected to the room, send the socket to sockets array
    socket.username = username
    rooms[socket.room]["sockets"].push(socket)
    addedUser = true
    console.log('Connection: %s sockets connected', rooms[socket.room]["sockets"].length)
    socket.in(socket.room).broadcast.emit('room info', {
      username: socket.username,
      numUsers: rooms[socket.room]["sockets"].length
    })
  })

  //Disconnect
  socket.on('disconnect', function(){
    // When a user disconnect, remove it from the sockets list
    if(addedUser) {
      rooms[socket.room]["sockets"].splice(rooms["111"]["sockets"].indexOf(socket), 1)
      console.log('1 user disconnected, Connection: %s sockets connected', rooms[socket.room]["sockets"].length)
      socket.broadcast.emit('room info', {
        username: socket.username,
        numUsers: rooms[socket.room]["sockets"].length
      })
      socket.leave(socket.room)
    }
  })
})
