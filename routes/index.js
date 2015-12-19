var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('../index', {
        title: 'Demo Site',
        isHomePage: true,
        user: req.user
    });
});

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));


module.exports = router;
