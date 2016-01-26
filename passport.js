var Sequelize = require('sequelize');


module.exports = function(passport, Strategy, bcrypt, db){

var User = db.define('User', {
  username: {type: Sequelize.STRING, unique: true},
  password: Sequelize.STRING,
  usertables: Sequelize.ARRAY(Sequelize.TEXT)
});

User.sync();

passport.serializeUser(function(user, done) {
  console.log(user.id)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User
    .findById(id).then( function(user) {
      console.log(id)
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    });
});

passport.use('register', new Strategy({usernameField: 'user', passwordField: 'pass', passReqToCallback: true}, function(req, user, pass, done) {
  console.log("REgister")
  User
    .findOrCreate({where: {username: user}, defaults: {password: pass, usertables: []} }).spread(function(u,c) {
      if (!c) {
        console.log("fauikl")
        return done(null, false, {message: "username taken"})
      } else {
        console.log("WHAT")
          return done(null, u);
        }
      })
    })
)

passport.use('login', new Strategy({usernameField: 'user', passwordField: 'pass', passReqToCallback: true}, function(req, user, pass, done) {
  User
    .findOne( { where: {username: user} } ).then( function(u) {
      if (!u)
        return done(null, false, {message: "user not found"})
      if (!bcrypt.compareSync(pass, u.password))
        return done(null, false, {message: "wrong password"})
      return done(null, u)
    })
}))

}
