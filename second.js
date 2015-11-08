var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var fs = require('fs');
var mongoose = require('mongoose');


//var client = mongodb.MongoClient;
var address = 'mongodb://localhost:27017/logindb';

mongoose.connect(address);

var user = mongoose.model('users', {username: String, contact: String, mail: String, password: String});

var conn = mongoose.connection;

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('files'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({dest:'/home/nikhil/project/files'}).single('file'));


http.listen(8081);
// routing
app.get('/chat', function (req, res) {



    res.sendFile('/home/nikhil/project/ex.html');
});


//Login function

app.get('/login', function(req, res){

  fs.readFile('/home/nikhil/project/login/login.html', function(err, data){



    if(err)
      console.log('unable to read html');
    else
    {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write(data);
      res.end();

    }
  });

  //res.writeHead(200, {'Content-Type':'text/css'});
	//res.sendFile('/home/nikhil/project/login/login.html');
});

app.post('/validate', function(req, res){

  console.log("Here!");
  user.findOne({username:req.body.username},function(err, obj){

    if(err)
      res.end('please try again');
    
    if(obj!=""){

      if(obj.password==req.body.password){
        res.sendFile('/home/nikhil/project/ex.html');
        console.log('found', obj.password);
    }
    else
      res.end('please try again');

    }
    else
      res.end("please try again");
  });
});


app.post('/signup', function(req, res){


  conn.collection('users').insert({username:req.body.username, contact:'9012', email:req.body.email, password:req.body.password});
  console.log("inserted");

});
	/*client.connect(address, function(err, db){
		
		if(err)
			console.log("connected");	
		else{
			
			var users = db.collection('users');
			users.find({username:req.body.username}).toArray(function(err, result){
				
				
				if(err)
					res.end('nooooooo');
				else if(result.length && result.password==req.body.password){
					res.sendFile('/home/nikhil/project/ex.html');
					}
          else
            res.end('nooooooo')
			}); 

      
		});
	});*/

//file upload

app.post('/file_upload', function (req, res) {

   console.log(req.file.originalname);
   console.log(req.file.path);
   console.log(req.file.type);

   var file = "/home/nikhil/project/files/" + req.file.originalname;
   io.sockets.emit('sendchat', 'http://192.168.1.107:8081/'+req.file.originalname);
   
   fs.readFile( req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully',
                   filename:req.file.name
              };
          }
          
          res.end("OK");

       });
   });
});

// usernames which are currently connected to the chat
var usernames = {};
// rooms which are currently available in chat
var rooms = [];
io.sockets.on('connection', function (socket) {
	socket.on('adduser', function (username, room) {

        //socket.emit('validate', 'Nikhil','13123','bhatia.nikhil95@gmail.com','pass');
        if(rooms.indexOf(room) != -1)
        {  
            socket.username = username;
            socket.room = room;
            usernames[username] = username;
            socket.join(room);
            socket.emit('updatechat', 'SERVER', 'You are connected. Start chatting');
            socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
        }else{
            socket.emit('updatechat', 'SERVER', 'Please enter valid code.');
        }
    });
	socket.on('createroom', function () {
		var new_room = (""+Math.random()).substring(2,7);
		rooms.push(new_room);
        socket.emit('updatechat', 'SERVER', 'Your room is ready, invite someone using this ID:' + new_room);
		socket.emit('roomcreated', new_room);
	});
    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
       	 socket.emit('updatechat', socket.username, data);
	 socket.broadcast.to(socket.room).emit('updatechat', socket.username, data);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        if(socket.username !== undefined){
        	socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        	socket.leave(socket.room);
        }
    });

    /*socket.on('validate', function(usernam, number, email, pass){

        var newUser = {username:usernam, contact:number, mail:email, password:pass};
        user.insert(newUser);


    });*/
});
