var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
    var errors = req.flash('error');
    var error = '';
    if (errors.length) {
        error = errors[0];
    }
    var msg = req.flash('msg');
    res.render('partials/signup', {
        title: 'Signup',
        error: error,
        isLoginPage: true,
        msg: msg
    });
});
router.post('/', function(req, res, next) {
    var User = mongoose.model('User');
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var dobday = req.body.dobDay;
    var dobmonth = req.body.dobMonth;
    var dobyear = req.body.dobYear;
    var password = req.body.password;
    User.findOne({
        email: email
    }, function(err, user) {
        if (user !== null) {
            req.flash('registerStatus', false);
            req.flash('error', 'We have already an account with email: ' + email);
            res.redirect('/');
        } else { // no user found
            if (password) {
                var u = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: util.encrypt(password),
                    dob: {
                        day: dobday,
                        month: dobmonth,
                        year: dobyear
                    }
                });
                u.save(function(err) {
                    if (err) {
                        next(err);
                    } else {
                        console.log('new user:' + u);
                        req.login(u, function(err) {
                            if (err) {
                                return next(err);
                            }
                            req.flash('registerStatus', true);
                            req.flash('registerSuccessMessage', 'Welcome ' + u.firstName + "!");

                            return res.redirect('/message');
                        });
                    }
                });
            } else {
                req.flash('registerStatus', false);
                req.flash('error', 'The confirmation password does not match the password');
                res.redirect('/register');
            }
        }

    });
});
module.exports = router;
