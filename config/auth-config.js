var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

var facebookConfig = {
    clientID : "194113547890147",
    clientSecret : "0b2e989eefe4ff23b5b18ca150cb11ff",
    callbackURL : "http://localhost:3000/facebook/callback"
};

var localRegisterInit = (req, email, password, cb) => {
    User.findOne({ "local.email" : email }, (err, user) => {
        if (err) {
            return cb(err);
        }

        if (user) {
            // TODO: supply message to user
            return cb(null, false);
        }

        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.hashPassword(password);

        newUser.save((err) => {
            if (err) {
                throw err;
            }

            return cb(null, newUser);
        });
    });
};

var localLoginInit = (req, email, password, cb) => {
    console.log(`from local login init: email: ${email}; password: ${password}`);

    User.findOne({ "local.email" : email}, (err, user) => {
        if (err) {
            console.log(`error from the db call - can't find password`);
            return cb(err);
        }

        if (!user || !user.validatePassword(password)) {
            // TODO: supply generic message to user
            return cb(null, false);
        }

       return cb(null, user);
    });
};

var localOptions = {
    usernameField : "emailAddress",
    passReqToCallback : true
};

var facebookInit = function(token, refreshToken, profile, cb) {
    User.findOne( { "facebook.id" : profile.id }, function(err, user) {
        if (err) {
            return cb(err);
        }

        if (user) {
            return callback(null, user);
        }

        var newUser = new User();

        console.log(newUser)

        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.email = profile.emails[0].value;

        console.log(newUser);

        newUser.save(function(err) {
            if (err) { throw err};

            return cb(null, newUser);
        })
    })
};

passport.use("local-register", new LocalStrategy(localOptions, localRegisterInit));
passport.use('local-login', new LocalStrategy(localOptions, localLoginInit));

passport.use(new FacebookStrategy(facebookConfig, facebookInit));

// serialize / deserialize
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        cb(err, user);
    });
});

module.exports = {
    localRegister : passport.authenticate("local-register", {
        successRedirect : "/",
        failureRedirect : "/register"
    }),

    localLogin : passport.authenticate("local-login", {
        successRedirect : "/",
        failureRedirect : "/login"
    }),

    facebookLogin : passport.authenticate("facebook", { scope : "email" }),
    facebookCallback : passport.authenticate("facebook", {
        successRedirect : "/profile",
        failureRedirect : "/"
    })
}