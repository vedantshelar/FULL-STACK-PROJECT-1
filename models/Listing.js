const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');
const Review = require('./Review');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1
    },
    description: {
        type: String,
        required: true,
        minLength: 1
    },
    listingImages:{
        type:[
            {
                filename:String,
                link:String
            }
        ], 
        required:true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    country: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ], 
    city:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["farms","beachfront","lakefront","camping","mountain","town","tower","cities","others"],
        required:true
    }
});

// Query middleware

listingSchema.post('findOneAndDelete', async (listingData) => {

    const result = await Review.deleteMany({ _id: { $in: listingData.reviews } });
    console.log(result);

    console.log("deleted reviews associated with deleted listing");
}) 

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;