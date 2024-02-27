const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  email : {
    required : true,
    unique : true,
    
  },
  password : {
    required :true,
    minlength : 5,

  }
},);

const users = mongoose.model('users', userSchema);

module.exports = users;