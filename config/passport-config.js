const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const users = require("../models").users;
const bcrypt = require("bcrypt");

//Strategies
module.exports = function init(passport) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      // Verify callback
      users
        .findOne({ where: { usuario: username } })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Usuário incorreto!" });
          }
          if (!bcrypt.compareSync(password, user.senha)) {
            return done(null, false, { message: "Senha incorreta!" });
          }
          users
            .update(
              {
                ultimo_login: new Date(),
              },
              {
                where: {
                  usuario: user.usuario,
                },
              }
            )
            .then(() => {
              return done(null, user);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => done(err));
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    users
      .findByPk(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
};
