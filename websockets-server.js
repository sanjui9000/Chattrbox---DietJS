var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});

var messages = [];
var topic = '';

console.log('Websockets server started');

ws.on('connection', function(socket) {
  console.log('Client connection established');
  if (topic != '') {
    socket.send(topic);
  }
  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on('message', function(data) {
    if (data.startsWith('/topic ')) {
      if (data.slice(7) == '' || data.slice(7).trim().length == 0) {
        console.log('Please enter a valid name for topic.');
        return;
      }
      ws.clients.forEach(function(clientSocket) {
        topic = '*** Topic has changed to ' + '"' + data.slice(7) + '"';
        clientSocket.send(topic);
        return;
      });
    } else {
      console.log('Message received: ' + data);
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    }
  });
});
