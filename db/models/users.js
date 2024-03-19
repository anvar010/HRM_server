const mongoose = require('mongoose');

const users = new mongoose.Schema({
    first_name : {
        type : String,
        required : true,
    },
    last_name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        unique : true,
    },
    user_type: {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "user_types"
    },
    password : {
        type : String,
        required : true
    },
    password_token: { 
        type: String 
    }

});

module.exports = mongoose.model("users",users);