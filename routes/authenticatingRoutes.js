const middleware = require('../middlewares');
const passport = require('passport');
const express = require('express');
const authenticatingControllers = require('../controlls/authenticatingControllers');
const { route } = require('./listingRoutes');
const router = express.Router({ mergeParams: true });

//API to render signup form
//API to save signed up user info to database

router.route('/signup')
    .get(authenticatingControllers.signupForm)
    .post(authenticatingControllers.saveNewUserInfo)


//API to render login form
//API to authentication user

router.route('/login')
    .get(authenticatingControllers.loginForm)
    .post(middleware.saveRedirectedUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), authenticatingControllers.authenticatingUser);

//API to log out user 

router.get('/logout', middleware.isLoggedIn, authenticatingControllers.logoutUser);

router.get('/testing', authenticatingControllers.testing);

//API to render profile page

router.route('/:userId/profile')
    .get(authenticatingControllers.showUserProfile);

//API to render edit profile form page
//API to save edit profile form data page

router.route('/:userId/profile/edit')
    .get(authenticatingControllers.editProfileForm)
    .put(authenticatingControllers.saveEditedProfileFormData);

//API to render edit profile password form page

router.route('/:userId/profile/edit/password')
    .get(authenticatingControllers.showEditPasswordProfileForm)
    .put(authenticatingControllers.saveEditedPassword);

//API to render edit profile password form page

router.route('/:userId/profile/delete')
    .get(authenticatingControllers.editProfileForm)
    .delete(authenticatingControllers.destroyUser);

module.exports = router;
 