const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Listing = require('../models/Listing');

const userSchema = new mongoose.Schema({
    phone: {
        type: Number,  
        required: true
    },
    email: {
        type: String,
        required: true
    } 
})

userSchema.plugin(passportLocalMongoose);

// query middleware

userSchema.post('findOneAndDelete',async (user) =>{
    let userId = user._id;
    let listings = await Listing.find({owner:userId});
    for(listing of listings){
        await Listing.findByIdAndDelete(listing._id);  
    } 
})

const User = mongoose.model("User", userSchema);

module.exports = User;