const User = require('../models/User');
const myError = require('../myError');
const userSchemaValidator = require('../schemaValidators/userSchemaValidator');

let signupForm = (req, res) => {
    res.render("signup.ejs");
};


let saveNewUserInfo = async (req, res, next) => {

    try {

        let result = userSchemaValidator.validate(req.body);
        let phone = req.body.phone;

        if (phone.length != 10) {
            next(new myError("Please enter valid number"));
        } else {

            if (result.error) {
                let validationError = result.error.details[0].message;
                next(new myError(validationError));
            } else {
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
            }
        }


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

//testing

let testing = async (req, res, next) => {

    const user = await User.findOne({ username: 'abhi' });

    console.log(user);


    if (!user) {
        res.send('user not found');
    }

    const isMatch = await user.authenticate("abhi");

    if (isMatch) {
        res.send('correct')
    } else {
        res.send('incorrent pawword')
    }
}

//profile

let showUserProfile = async (req, res, next) => {
    let userId = req.params.userId;
    try {
        let userInfo = await User.findById(userId);
        res.render("profile.ejs", { user: userInfo });
    } catch (err) {
        next(err);
    }
}

// edit profile form

let editProfileForm = async (req, res, next) => {
    let userId = req.params.userId;
    try {
        let userInfo = await User.findById(userId);
        res.render("editProfileForm.ejs", { user: userInfo });
    } catch (err) {
        next(err);
    }
}

// save edit profile form data

let saveEditedProfileFormData = async (req, res, next) => {
    let userId = req.params.userId;
    try {
        console.log(req.body);
        await User.findByIdAndUpdate(userId, req.body);
        req.flash("success", "Profile data has been updated successfully")
        res.redirect(`/${userId}/profile`);
    } catch (err) {
        next(err);
    }
}

//  edit profile password form data

let showEditPasswordProfileForm = (req, res, next) => {
    res.render("editProfilePasswordForm.ejs", { userId: req.params.userId });
}

// save edited user password

let saveEditedPassword = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        let user = await User.findById(userId);

        user.changePassword(oldPassword, newPassword, (err) => {
            if (err) {
                req.flash("error", "Password is not changed")
                res.redirect(`/${userId}/profile/edit/password`);
            } else {
                req.flash("success", "Password has been successfully changed")
                res.redirect(`/${userId}/profile/edit`);
            }
        })

    } catch (err) {
        next(err)
    }
}

// delete user account 

let destroyUser = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let deletedUserInfo = await User.findByIdAndDelete(userId);
        req.flash("success", "User ACCOUNT has been successfully deleted");
        res.redirect('/list');
    } catch (error) {
        next(error);
    }
} 

module.exports = {
    signupForm,
    saveNewUserInfo,
    loginForm,
    authenticatingUser,
    logoutUser,
    testing: testing,
    showUserProfile: showUserProfile,
    editProfileForm: editProfileForm,
    saveEditedProfileFormData: saveEditedProfileFormData,
    showEditPasswordProfileForm: showEditPasswordProfileForm,
    saveEditedPassword: saveEditedPassword,
    destroyUser: destroyUser
}