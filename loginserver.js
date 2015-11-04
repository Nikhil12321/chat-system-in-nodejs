var mongodb = require('mongodb');


var client = mongodb.MongoClient;


client.connect('mongodb://localhost:27017/logindb', function(err, db){
	
	if(err)
		console.log("error in connecting to database", err);
	else{
		console.log("connected with database successfully");


		var users = db.collection('users');
		var user1 = {username:'Nikhil', password:'1234pass'};
		users.insert(user1, function(err, result){


			if(err)
				console.log('insertion error');

			else{


				console.log('inserted');
			}
		}
);
}
}

	
	
	
		);
