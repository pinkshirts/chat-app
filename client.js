$(function(){
  var socket = io()
  $('#usernameForm').submit(function(e){
    e.preventDefault()
    var username = $('#usernameInput').val()
    socket.emit('add user', username)
  })

  $('#chatroom').submit(function(e){
    e.preventDefault()
    socket.emit('new message', $('#inputMessage').val())
    $('#inputMessage').val('')
    return false
  })

  socket.on('new message', function(data){
    var message = data.username + ": " + data.message
    $('#messages').append($('<li>').text(message))
  })

  socket.on('room info', function(data){
    var message = data.username + " joined, there are " + data.numUsers + " users."
    $('#messages').append($('<li>').text(message))
  })
})
