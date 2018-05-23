var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var authenticate = function(username, password, cb) {
    if (username === 'foo' && password === 'bar') {
       return cb(null, {
            username : 'foo',
            displayName : 'theFoo'
        });
    } else {
        return cb(null, false);
    }

    return cb({
        message : "something went wrong"
    });
};

passport.use(new BasicStrategy(authenticate));

exports.isAuthenticated = passport.authenticate("basic", { session: false });