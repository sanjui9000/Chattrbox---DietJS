var fs = require('fs');
var wss = require('./websockets-server'); // eslint-disable-line no-unused-vars
var mime = require('mime');
var path = require('path');

// Get list of all file names in app folder
var fileNames = [];
fs.readdir('app', function(err, files) {
  files.forEach(function(file) {
    fileNames.push(file);
  });
});

// Require diet & create its instance
var server = require('diet');
var app = server();
app.listen('http://localhost:8000');

// When http://localhost:8000/ is requested, respond with "Hello World!"
app.get('/', function($) {
  var fileName = 'index.html';
  var filePath = path.resolve(__dirname, 'app', fileName);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      handleError($);
    } else {
      var mimeResult = mime.lookup(filePath);
      $.header('content-type', mimeResult);
      $.send(data);
      $.end();
    }
  });
});

// Visiting "http://localhost:8000/---something---" should return:
app.get('/:filename', function($) {
  if (fileNames.includes($.params.filename)) {
    var fileName = $.params.filename;
    var filePath = path.resolve(__dirname, 'app', fileName);
    console.log(filePath);
    fs.readFile(filePath, function(err, data) {
      if (err) {
        // handleError(err, res);
        console.log(err);
        return;
      } else {
        var mimeResult = mime.lookup(filePath);
        $.header('content-type', mimeResult);
        $.send(data);
        $.end();
      }
    });
  } else {
    handleError($);
  }
});


var handleError = function($) {
  var fileName = 'error.html';
  var filePath = path.resolve(__dirname, 'app', fileName);
  var mimeResult = mime.lookup(filePath);
  $.header('Content-Type', mimeResult);
  $.header('Status', 404);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      console.log('There is some issue with server!');
      return;
    } else {
      $.send(data);
      $.end();
    }
  });
};
