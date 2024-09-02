const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');
const Review = require('./Review');

const listingSchema = new mongoose.Schema({
    propertyArea: {
        type: String,
        required: true,
        enum:["1BHK","2BHK","3BHK","4BHK","NOT APPLICABLE"]
    },
    description: {
        type: String, 
        required: true,
        minLength: 1
    },
    listingImages: [
        {
            filename: String,
            link: String
        } 
    ],
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
    city: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["farms", "beachfront", "lakefront", "camping", "mountain", "town", "tower", "cities", "others"],
        required: true
    }
});

// Query middleware

listingSchema.post('findOneAndDelete', async (listingData) => {

    if(listingData.reviews.length!=0){
        const result = await Review.deleteMany({ _id: { $in: listingData.reviews } });
    }

})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;