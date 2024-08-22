const Listing = require('../models/Listing.js');
const Review = require('../models/Review');
const middleware = require('../middlewares');
const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const storage = require('../cloudConfiguration.js');
const upload = multer({ storage });
const listingControlls = require('../controlls/listingControlls.js');

//all listings

router.route('/')
    .get(listingControlls.index)

//API to display listing information based on search input 

router.route('/search')
    .get(listingControlls.searchedListings);

//API to display listings based on category

router.route('/category/:inputCategory')
    .get(listingControlls.showingListingByCategoryInput);

//API to render filter form and display listings based on filter output

router.route('/filter')
    .get(listingControlls.filterForm)

//APT to display listings based on filter data

router.route('/filter/data')
    .get(listingControlls.filterResult); 

// create list form
// storing new listing info into the listing database

router.route('/new')
    .get(listingControlls.createListingForm)
    .post(middleware.isLoggedIn, upload.fields([{ name: 'listingImage1' }, { name: 'listingImage2' }, { name: 'listingImage3' }, { name: 'listingImage4' }]), listingControlls.saveListingInfo);


// showing single list

router.route('/:listId')
    .get(listingControlls.singleListingInfo);

//storing review in review database

router.route('/:listId/review/new')
    .post(listingControlls.saveReviewInfo);

//edit single listing form 
//storing edited listing information into the database

router.route('/:listId/edit')
    .get(middleware.isLoggedIn, middleware.isListingOwner, listingControlls.editListingForm)
    .post(middleware.isLoggedIn, middleware.isListingOwner, upload.fields([{ name: 'listingImage1' }, { name: 'listingImage2' }, { name: 'listingImage3' }, { name: 'listingImage4' }]), listingControlls.saveEditedListingInfo);


//delete listing

router.route('/:listId')
    .delete(middleware.isLoggedIn, middleware.isListingOwner, listingControlls.distroyListing);


module.exports = router;