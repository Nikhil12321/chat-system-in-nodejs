var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var fs = require('fs');
var mongoose = require('mongoose');

http.listen(8081);

some("hey");


function some(data){

	console.log(data);
}

io.sockets.on('connection', function(socket){


	socket.on('event', some(data));
});