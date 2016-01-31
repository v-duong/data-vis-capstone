var Sequelize = require('sequelize');


module.exports = function(passport, Strategy, bcrypt, sequelize){

  var User = sequelize.define('User', {
    username: {type: Sequelize.STRING, unique: true},
    password: Sequelize.STRING,
    usertables: Sequelize.ARRAY(Sequelize.TEXT),

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
        //console.log(user)
        done(null, user);
      });
  });

  passport.use('register', new Strategy({usernameField: 'user', passwordField: 'pass', passReqToCallback: true},function(req, user, pass, done) {
    User
      .findOrCreate({where: {username: user.toLowerCase()}, defaults: {password: bcrypt.hashSync(pass, 5), usertables: []} }).spread(function(u,c) {
        if (!c) {
          return done(null, false, {message: "Username is already in use."})
        } else {

            sequelize.createSchema("u"+u.id);
            return done(null, u);
          }
        })
      })
  )

  passport.use('login', new Strategy({usernameField: 'user', passwordField: 'pass', passReqToCallback: true}, function(req, user, pass, done) {
    User
      .findOne( { where: {username: user.toLowerCase()} } ).then( function(u) {
        if (!u)
          return done(null, false, {message: "Login failed: Incorrect credentials."})
        if (!bcrypt.compareSync(pass, u.password))
          return done(null, false, {message: "Login failed: Incorrect credentials."})
        return done(null, u)
      })
  }))
}
