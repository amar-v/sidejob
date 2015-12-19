var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

var router = express.Router();
router.get('/', function(req, res) {
    var errors = req.flash('error');
    var msg = req.flash('msg');
    var error = '';
    if (errors.length) {
        error = errors[0];
    }

    res.render('partials/signin', {
        title: 'Signin',
        error: error,
        msg: msg,
        user: req.user,
        isLoginPage: true
    });
});

router.post('/',
    passport.authenticate('local', {
        failureRedirect: '/?error',
        failureFlash: true
    }),

    function(req, res) {
        User.findOneAndUpdate({
            _id: req.user._id
        }, {
            lastConnection: new Date()
        }, {}, function(err, user) {
            if (user) {
                console.log(user);
                req.flash('welcomeMessage', 'Welcome ' + user.name + '!');
                res.redirect('/');
            }
            if (err) {
                console.log(err);
            }
        });
    });

module.exports = router;
