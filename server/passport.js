var facebookAuth = {
  'clientId' : '1171407722880061',
  'clientSecret' : '6cde384abc81b47f044b0ee9b1195882',
  'callbackUrl' : 'http://localhost:4000/auth/facebook/callback'
}; 

var FacebookStrategy = require('passport-facebook').Strategy;

var Users = require('./db/collections/users.js'); 
var User = require('./db/models/user.js'); 

var configAuth = require('./passport-config.js'); 

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id); 
  }); 

  passport.deserializeUser(function(id, done)  {
    Users.reset()
      .query({where: {fbId: id}})
      .fetch()
      .then(function (user) {
        done(user); 
      }); 
  }); 

  passport.use(new FacebookStrategy({
    clientId : configAuth.facebookAuth.clientId,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL
  })); 

  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      Users.reset()
        .query({where: {fbId: profile.id}})
        .fetch()
        .then(function (user) {
          done(err, user); 
        }); 
    })
  }

}

