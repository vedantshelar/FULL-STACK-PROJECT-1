const middleware = require('../middlewares');
const passport = require('passport');
const express = require('express');
const authenticatingControllers = require('../controlls/authenticatingControllers');
const router = express.Router({mergeParams:true});

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
 
module.exports = router;
