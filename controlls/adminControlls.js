let adminLoginForm = (req, res, next) => {
    res.render('adminLoginPage.ejs');
};

let adminLogin = async (req, res, next) => {
    try {
        let admin = await Admin.findOne({ adminName: req.body.adminName, adminCode: req.body.adminCode });
        if (admin) {
            req.session.admin = admin;
            req.flash("success", "admin successfully login");
            res.redirect('/list');
        } else {
            req.flash('error', 'Invalid Credentials');
            res.redirect('/admin/login');
        }
    } catch (error) {
        next(error);
    }
}

let adminLogout = (req, res, next) => {
    delete req.session.admin;
    req.flash("success", "Admin logout successfully");
    res.redirect('/list');
}


let adminSignUpForm = (req, res) => {
    res.render('adminSignUpPage.ejs');
}

let saveAdminInfo = async (req, res, next) => {
    try {
        let admin = new Admin(req.body);
        admin = await admin.save();
        req.session.admin = admin;
        req.flash('success', 'admin successfully login')
        res.redirect('/list');
    } catch (error) {
        next(error)
    }

}

let adminManager = async (req, res, next) => {
    try {
        const admin = await Admin.find();
        res.render('adminControlPage.ejs', { admins: admin })
    } catch (error) {
        next(error);
    }
}

let destroyAdmin = async (req, res, next) => {
    try {
        if (req.session.admin) {
            const adminId = req.params.adminId;
            let deletedAdminAccount = await Admin.findByIdAndDelete(adminId);
            req.flash('success', "Admin account has been deleted");
            res.redirect('/admin/control');
        } else {
            req.flash('error', "you are not authorize to delete admin account");
            res.redirect('/admin/login');
        } 
    } catch (error) {
        next(error)
    }
}


module.exports = {
    adminLoginForm: adminLoginForm,
    adminLogin: adminLogin,
    adminLogout: adminLogout,
    adminSignUpForm: adminSignUpForm,
    saveAdminInfo: saveAdminInfo,
    adminManager: adminManager,
    destroyAdmin: destroyAdmin
}