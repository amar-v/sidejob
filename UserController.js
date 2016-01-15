var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');

var path = require('path');

UserController = function() {};

UserController.prototype.uploadFile = function(req, res) {
    // We are able to access req.files.file thanks to 
    // the multiparty middleware
    var file = req.files.file;
    console.log(file.name);
    console.log(file.type);
    console.log(file)
    console.log(file.fieldName)

    for(i=file.path.length;i>0;i--) {
    	if(file.path[i]=="\\"){
    		break
    	}
    }
    var filename = file.path.substring(i+1,file.path.length);
    console.log("filename: " + req.headers.host + '/profileimages/' + filename)


    User.findOne({_id: req.session.passport.user},function(err,user) {
        user.avatar = filename;
        user.save();
    });

    res.json({url: 'http://' + req.headers.host + '/profileimages/' + filename})
   
}

module.exports = new UserController();