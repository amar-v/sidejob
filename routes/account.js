var express = require('express');
var mongoose = require('mongoose');
var util = require('../config/util.js');
var router = express.Router();
var moment = require('moment');

/* GET user account details. */
router.get('/', function(req, res) {
    if (!req.user) {
        return res.redirect("/");
    }
    var msg = req.flash('msg');
    res.render('partials/account', {
        title: 'Site Registered User Account',
        user: req.user,
        msg: msg,
        isAccountPage: true,
        lastConnection: moment(req.user.lastConnection).fromNow()
    });
});

/* Update user account. */
router.post('/', function(req, res) {
    if (!req.user) {
        return res.redirect("/");
    }
    var User = mongoose.model('User');
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var currentPassword = req.body.password;
    var newPassword = req.body.newPassword;
    var confirmNewPassword = req.body.confirmNewPassword;
    var hash = util.encrypt(currentPassword);
    if (newPassword) {
        if (hash === req.user.password) {
            if (newPassword === confirmNewPassword) {
                var newPasswordHash = util.encrypt(newPassword);
                User.findOneAndUpdate({
                    _id: req.user._id
                }, {
                    password: newPasswordHash
                }, {}, function(err, user) {
                    req.user = user;
                    req.flash('updateStatus', true);
                    req.flash('updateMessage', 'Your password has been updated successfully');
                });
            } else {
                req.flash('updateStatus', false);
                req.flash('updateMessage', 'The confirmation password does not match the new password');
            }
        } else {
            req.flash('updateStatus', false);
            req.flash('updateMessage', 'The current password is incorrect');
        }
    }

    User.findOneAndUpdate({
        _id: req.user._id
    }, {
        firstName: firstName,
        lastName: lastName
    }, {}, function(err, user) {
        req.user = user;
        req.flash('updateStatus', true);
        req.flash('updateMessage', 'Your Mobile has been updated successfully');
        res.redirect('/account');
    });
});

module.exports = router;
