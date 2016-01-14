var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var auth = require('./auth');

module.exports = function(app, passport) {

    // serialize sessions
    passport.serializeUser(function(user, done) {
        console.log("id is " + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user)
        });
    });

    //use facebook stragtegy
    passport.use(new FacebookStrategy({
            clientID: auth.fbAuth.clientID,
            clientSecret: auth.fbAuth.clientSecret,
            callbackURL: auth.fbAuth.callbackURL
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        console.log(profile);
                        //newUser.facebook.email = profile.emails[0].value;
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser)
                        });
                    }
                })
                ''
            })
            ''
        }
    ));

    //use google stragtegy
    passport.use(new GoogleStrategy({
            clientID: auth.googleAuth.clientID,
            clientSecret: auth.googleAuth.clientSecret,
            callbackURL: auth.googleAuth.callbackURL
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({
                    'google.id': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;
                        console.log(profile);
                        newUser.email = profile.emails[0].value;
                        newUser.google.email = profile.emails[0].value;
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser)
                        });
                    }
                })
                ''
            })
            ''
        }
    ));


    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {

            User.findOne({
                email: email
            }, function(err, user) {

                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, {
                        message: 'This email is not registered'
                    });
                }

                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid login or password'
                    });
                }

                return done(null, user);
            });
        }
    ));

};
