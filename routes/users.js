const express = require('express');
const router = express.Router();
const passport = require('passport');
//const bcrypt = require('bcrypt');
const User = require('../models/user');
const wrap = require('../utilities/wrap');
const users = require('../controllers/users');

const printReturnTo = (req, res, next) => {
    console.log("from middleware: ", req.session.returnTo);
    next();
}

router.route('/register')
    .get(users.renderRegisterForm)
    .post(wrap(users.register));

router.route('/login')
    .get(users.renderLoginForm)
    .post(
    printReturnTo, // --> campgrounds/new
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    printReturnTo, // --> undefined
    users.login);

router.get('/logout', users.logout);

module.exports = router;
