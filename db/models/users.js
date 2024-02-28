const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name : {
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
    }
});

module.exports = mongoose.model("users",users);