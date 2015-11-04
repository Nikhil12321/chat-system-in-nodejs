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
var global_username;
var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('files'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({dest:'/home/nikhil/project/files'}).single('file'));



http.listen(8081);
// routing
app.get('/', function (req, res) {

    console.log('trying');
    res.sendFile('/home/nikhil/project/ex.html');

});

app.get('/white_board', function(req, res){


    res.sendFile('/home/nikhil/project/index.html');
    io.sockets.emit('updateboard', global_username ,'**Opened a collaborative board**');
});



app.get('/login', function(req, res){


  console.log('trying');
  res.sendFile('/home/nikhil/project/login/login.html');
});

app.get('/display', function(req, res){


  var all_clients;

  console.log('number of rooms', rooms.length);

  for (var item=0; item<rooms.length;item++){



    var r = io.sockets.adapter.rooms[rooms[item]];

    if(r){



      for (var client in r){


        console.log(io.sockets.adapter.nsp.connected[client].username);
      }
    }
  }

  res.end();
});



app.post('/validate', function(req, res){

  console.log("Here!");
  user.findOne({username:req.body.username},function(err, obj){

    if(err)
      res.end('please try again');
    
    if(obj!=""){

      global_username=obj.username;
      if(obj.password==req.body.password){
        res.sendFile('/home/nikhil/project/ex.html');
        console.log('found', obj.username, obj.password);
        
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


app.post('/file_upload', function (req, res) {

   console.log(req.file.originalname);
   console.log(req.file.path);
   console.log(req.file.type);

   var file = "/home/nikhil/project/files/" + req.file.originalname;
   io.sockets.emit('updatelink', req.body.uname ,'http://192.168.1.107:8081/'+req.file.originalname);
   
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
            console.log('added user ', username);
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

  socket.on('getuname', function(){


    io.sockets.emit('start', global_username);
  });
    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function(data){


      if(socket.room!=null){
         socket.emit('updatechat', socket.username, data);
         console.log(socket.username);
         socket.broadcast.to(socket.room).emit('updatechat', socket.username, data);
        }
      else
          socket.emit('givealert');
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        if(socket.username !== undefined){
        	socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        	socket.leave(socket.room);
        }
    });


    socket.on('listusers', function(){

      var all_clients=[];

      console.log('number of rooms', rooms.length);

      for (var item=0; item<rooms.length;item++){



        var r = io.sockets.adapter.rooms[rooms[item]];

        if(r){



          for (var client in r){


            all_clients.push(io.sockets.adapter.nsp.connected[client].username);
          }
        }
      }

      socket.emit('getusers', all_clients);
    });

    /*socket.on('validate', function(usernam, number, email, pass){

        var newUser = {username:usernam, contact:number, mail:email, password:pass};
        user.insert(newUser);


    });*/
});
