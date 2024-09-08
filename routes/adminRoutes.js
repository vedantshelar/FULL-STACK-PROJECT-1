const express = require('express');
const Admin = require('../models/Admin');
const myError = require('../myError');
const router = express.Router({ mergeParams: true });
const adminControlls = require('../controlls/adminControlls');


router.route('/login')
    .get(adminControlls.adminLoginForm)
    .post(adminControlls.adminLogin) 

router.route('/logout') 
    .get(adminControlls.adminLogout)

router.route('/signUp')
    .get(adminControlls.adminSignUpForm)
    .post(adminControlls.saveAdminInfo)

router.route('/control')
    .get(adminControlls.adminManager)

router.route('/:adminId/delete')
    .delete(adminControlls.destroyAdmin)

module.exports = router;