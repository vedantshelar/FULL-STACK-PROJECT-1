const User = require('../models/User');

let signupForm = (req, res) => {
    res.render("signup.ejs");
};


let saveNewUserInfo =  async (req, res, next) => {

    try {
        const newUser = new User({
            phone: req.body.phone,
            email: req.body.email,
            username: req.body.username
        })

        const registeredUser = await User.register(newUser, req.body.password);

        req.login(registeredUser, (err) => {
            if (err) {
                req.flash('error', 'can not login');
                res.redirect('/');
            } else {
                req.flash('success', 'successfully sign-up and log-in');
                res.redirect('/list');
            }
        });

    } catch (error) {
        next(error);
    }

};

let loginForm = (req, res) => {
    res.render('login.ejs'); 
}

let authenticatingUser = async (req, res) => {

    req.flash('success', 'successfully logged in');
    console.log(res.locals.redirectUrl);
    
    res.redirect(res.locals.redirectUrl);
}

let logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", 'can not logged out');
            res.redirect('/');
        } else {
            req.flash('success', 'successfully logged out');
            res.redirect('/list');
        }
    })
}


module.exports = {  
    signupForm,
    saveNewUserInfo,
    loginForm,
    authenticatingUser,
    logoutUser
}