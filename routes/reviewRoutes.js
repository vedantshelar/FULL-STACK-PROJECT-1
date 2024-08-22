const reviewControllers = require('../controlls/reviewControlls');
const middleware = require('../middlewares');
const express = require('express');
const router = express.Router({mergeParams:true});

//to delete review 

router.delete('/:reviewId/:listId', middleware.isLoggedIn,reviewControllers.distroyReview);

module.exports = router;