var path = require('path');

function getVersion(){
  var version = (express.version || '4.').match(/^(\d)+\./)[1];
  return Number(version);
}

var express = require('express');

var app;

var version = getVersion();

if(version === 2){
  app = express.createServer();
} else if(version > 2){
  app = express();
}

app.use('/', express["static"].apply(null, [__dirname + '/']));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(8080);

console.log('Server running. Browse to http://localhost:8080');
