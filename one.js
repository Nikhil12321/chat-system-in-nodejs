var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

app.use(express.static('files'));


app.get('/chat', function(req, res){

	console.log("abb to aja");
	res.sendFile('/home/nikhil/project/home.html');
});

io.sockets.on('connection', function(socket){

	console.log("Here");
	socket.on('toServer', function(message){

		console.log(message);
	});
	//socket.emit("toClient", {message:'Hello'});
});


http.listen(8081);