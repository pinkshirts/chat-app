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
  var roomId = ''
  // Chat message
  socket.on('new message', function(data){
    console.log('message:' + data)
    io.emit('new message', {
      username: socket.username,
      message: data
    })
  })

  socket.on('choose room', function(roomIdInput){
    console.log(`The room id is ${roomIdInput}.`)
    // Check if roomIdInput exist
    if(typeof rooms[roomIdInput] !== "undefined") {
      isRoomExist = true
      roomId = roomIdInput
    }

    // If room doesn't exist, open a new room
    else {
      var newRoom = {
        roomIdInput: {
          "sockets": []
        }
      }
    }
  })

  // TODO: Broadcast chat messages and room infos into its own room instead of
  // the global server
  socket.on('add user', function(username){
    // If either current user added or the room doesn't exist, user cannot join
    if (addedUser || !isRoomExist) return

    // When connected to the room, send the socket to sockets array
    socket.username = username
    rooms[roomId]["sockets"].push(socket)
    addedUser = true
    console.log('Connection: %s sockets connected', rooms["111"]["sockets"].length)
    socket.broadcast.emit('room info', {
      username: socket.username,
      numUsers: rooms[roomId]["sockets"].length
    })
  })

  //Disconnect
  socket.on('disconnect', function(){
    // When a user disconnect, remove it from the sockets list
    if(addedUser) {
      rooms[roomId]["sockets"].splice(rooms["111"]["sockets"].indexOf(socket), 1)
      console.log('1 user disconnected, Connection: %s sockets connected', rooms["111"]["sockets"].length)

      socket.broadcast.emit('room info', {
        username: socket.username,
        numUsers: rooms[roomId]["sockets"].length
    })
  }
  })
})
