const Listing = require('../models/Listing.js');
const listingSchemaValidator = require('../schemaValidators/listingSchemaValidator.js');
const Review = require('../models/Review');
const myError = require('../myError.js');

let index = async (req, res, next) => {
    try {
        const listings = await Listing.find({});
        res.render('index.ejs', { listings: listings });
    } catch (error) {
        next(error);
    }
}

let searchedListings = async (req, res, next) => {
    try {
        let inputCity = req.query.searchInput;
        inputCity = inputCity.toLowerCase().trim();

        const listings = await Listing.find({ city: inputCity });
        res.render('index.ejs', { listings: listings });
    } catch (error) {
        next(error);
    }
}

let showingListingByCategoryInput = async (req, res, next) => {
    try {
        let inputCategory = req.params.inputCategory;
        const listings = await Listing.find({ category: inputCategory });

        if (listings.length == 0) {
            req.flash('error', "no such listing found with " + inputCategory + " category");
            res.redirect('/list');
        } else {
            res.render('index.ejs', { listings: listings });
        }

    } catch (error) {
        next(error);
    }
}

let createListingForm = (req, res) => {
    res.render('newListing.ejs');
}

let saveListingInfo = async (req, res, next) => {
    try {

        let listingImagesArray = [];

        for (listingImg in req.files) {
            listingImagesArray.push({
                link: req.files[listingImg][0].path,
                filename: req.files[listingImg][0].filename
            })
        }

        req.body.listingImages = listingImagesArray;
        req.body.country = req.body.country.toLowerCase();
        req.body.city = req.body.city.toLowerCase();
        req.body.category = req.body.category.toLowerCase();
        req.body.owner = req.user._id;

        let result = listingSchemaValidator.validate(req.body);
        if (result.error) {
            let validationError = result.error.details[0].message;
            next(new myError(validationError));
        } else {
            let newListing = new Listing(req.body);
            await newListing.save();
            res.redirect('/list');
        }

    } catch (error) {
        next(error)
    }
}

let singleListingInfo = async (req, res, next) => {
    try {
        const listId = req.params.listId;
        const singleListing = await Listing.findById(listId).populate('owner').populate({
            path: 'reviews', populate: {
                path: 'author'
            }
        });

        res.render('singleListing.ejs', { singleListing: singleListing });
    } catch (error) {
        next(error);
    }

}

let editListingForm = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.listId);
        res.render('listingEditForm.ejs', { listing: listing });
    } catch (error) {
        next(error);
    }

}

let saveEditedListingInfo = async (req, res, next) => {
    try {
        req.body.owner = req.user._id;
        req.body.propertyArea = req.body.propertyArea.toUpperCase();
        let result = listingSchemaValidator.validate(req.body);
        if (result.error) {
            let validationError = result.error.details[0].message;
            next(new myError(validationError));
        } else {

            let tempLength = 0;
            for (key in req.files) {
                tempLength++;
            }

            const listId = req.params.listId;
            const editedListing = await Listing.findByIdAndUpdate(listId, { $set: { propertyArea: req.body.propertyArea, description: req.body.description, price: req.body.price, country: req.body.country, location: req.body.location, city: req.body.city, category: req.body.category } }, { runValidators: true });
            if (tempLength > 0) {
                if (tempLength == 4) {
                    let listingImagesArray = []; 

                    for (listingImg in req.files) {
                        listingImagesArray.push({
                            link: req.files[listingImg][0].path,
                            filename: req.files[listingImg][0].filename
                        })
                    }
                    editedListing.listingImages = listingImagesArray;
                    await editedListing.save();
                    req.flash('success', 'successfully edited listing information');
                    res.redirect(`/list/${listId}`);
                } else {
                    req.flash('error', `you can not update only ${tempLength} listing images,you can only update all listing images`);
                    res.redirect(`/list/${listId}`);
                }

            } else {
                console.log("req.files does not exist");
                req.flash('success', 'successfully edited listing information');
                res.redirect(`/list/${listId}`);
            }
        }

    } catch (error) {
        next(error);
    }

}

let distroyListing = async (req, res, next) => {
    try {
        const listId = req.params.listId;
        const deletedListing = await Listing.findByIdAndDelete(listId);
        req.flash('success', 'successfully deleted listing');
        res.redirect('/list');
    } catch (error) {
        next(error);
    }
}

let saveReviewInfo = async (req, res, next) => {

    try {

        if (req.isAuthenticated()) {
            const listId = req.params.listId;

            let review = new Review({
                author: req.user._id,
                comment: req.body.comment,
                rating: req.body.rating
            })

            let savedReview = await review.save();

            let listing = await Listing.findByIdAndUpdate(listId, { $push: { reviews: savedReview._id } }, { runValidators: true });

            req.flash('success', 'successfully comment sent');
            res.redirect(`/list/${listId}`);
        } else {
            res.redirect('/login');
        }


    } catch (error) {
        next(error);
    }

}

let filterForm = async (req, res) => {
    let cities = await Listing.distinct('city');
    let countries = await Listing.distinct('country');
    res.locals.cities = cities;
    res.locals.countries = countries;
    res.render('filterForm.ejs');
}

let filterResult = async (req, res, next) => {
    try {
        let rentPrice = parseInt(req.query.rentPrice);

        let result = await Listing.find({ country: req.query.country, city: req.query.city, price: { $lte: rentPrice } })
        res.render('index.ejs', { listings: result });
    } catch (error) {
        next(error)
    }

}

module.exports = {
    index: index,
    createListingForm: createListingForm,
    saveListingInfo: saveListingInfo,
    singleListingInfo: singleListingInfo,
    editListingForm: editListingForm,
    saveEditedListingInfo: saveEditedListingInfo,
    distroyListing: distroyListing,
    saveReviewInfo: saveReviewInfo,
    searchedListings: searchedListings,
    showingListingByCategoryInput: showingListingByCategoryInput,
    filterForm: filterForm,
    filterResult: filterResult
} 