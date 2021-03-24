var bCrypt = require("bcryptjs");
var passport = require("passport");
var users = require("../models").users;

module.exports = function (passport) {
  var Auth = users;
  var LocalStrategy = require("passport-local").Strategy;

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email

        usernameField: "username",

        passwordField: "password",

        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      function (req, username, password, done) {
        var Auth = users;

        var isValidPassword = function (userpass, password) {
          console.log(`USERPASS IS ${userpass}`);
          console.log(`PASSWORD IS ${password}`);
          return bCrypt.compareSync(password, userpass);
        };
        console.log("logged to", username);
        Auth.findOne({
          where: {
            usuario: username,
          },
        })
          .then(function (user) {
            console.log(user);
            if (!user) {
              return done(null, false, {
                message: "Username does not exist",
              });
            }

            if (!isValidPassword(user.senha, password)) {
              return done(null, false, {
                message: "Incorrect password.",
              });
            }

            var userinfo = user.get();
            return done(null, userinfo);
          })
          .catch(function (err) {
            console.log("Error:", err);

            return done(null, false, {
              message: "Something went wrong with your Signin",
            });
          });
      }
    )
  );

  //serialize
  passport.serializeUser(function (user, done) {
    console.log("SERIALIZING!!!!!!!!!!!!!!");
    done(null, user.id);
  });

  // deserialize user
  passport.deserializeUser(function (id, done) {
    Auth.findByPk(id).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
