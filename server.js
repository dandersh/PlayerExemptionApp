var express = require('express'),
    http = require('http'),
    spawn = require('child_process').spawn,
    path = require('path');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    // set port
    app.set('port', process.env.port || 8000);
    // load resources
    app.use("/src", express.static(__dirname + '/src'));
    // load main page
    app.use("/",  express.static(__dirname + '/src'));
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('server is open on port: ' + app.get('port'));
});

spawn('open', ['http://localhost:8000']);

