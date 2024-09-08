const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    adminName:{
        type:String,
        required:true, 
        minLength:3,
        unique:true
    }, 
    adminCode:{
        type:String,  
        required:true
    }
})

const admin = mongoose.model("Admin", adminSchema);

module.exports = admin;   