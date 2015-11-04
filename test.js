var mongoose = require('mongoose');
var address = "mongodb://localhost:27017/logindb";

mongoose.connect(address);

var user = mongoose.model('users', {username: String, contact: String, mail: String, password: String});

user.insert('asdasd','asdadad','asda','adsa');