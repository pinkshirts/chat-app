$(function(){
  var socket = io()

  // Choose the room user wants to join
  $('#roomIdForm').submit(function(e){
    e.preventDefault()
    var roomId = $('#roomIdInput').val()
    socket.emit('choose room', roomIdInput)
  })

  // Define a user name
  $('#usernameForm').submit(function(e){
    e.preventDefault()
    var username = $('#usernameInput').val()
    socket.emit('add user', username)
  })

  // Chat message event
  $('#chatroom').submit(function(e){
    e.preventDefault()
    socket.emit('new message', $('#inputMessage').val())
    $('#inputMessage').val('')
    return false
  })

  // Execute when receives a new chat message
  socket.on('new message', function(data){
    var message = data.username + ": " + data.message
    $('#messages').append($('<li>').text(message))
  })

  socket.on('room info', function(data){
    var message = data.username + " joined, there are " + data.numUsers + " users."
    $('#messages').append($('<li>').text(message))
  })
})
