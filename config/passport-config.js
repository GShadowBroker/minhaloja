const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../models').users;
const bcrypt = require('bcryptjs');

//Strategies
module.exports = function init(passport) {
    
    passport.serializeUser(function(user, done) {
        console.log(`Serializing ${user.id}!`);
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        users.findOne({where:{id:id}})
            .then(user => {
                console.log(`De-serializing ${user.id}!`);
                done(null, user);
            })
            .catch(err =>done(err));
    });

    passport.use(new LocalStrategy(
        function(username, password, done){ // Verify callback
            users.findOne({where:{usuario:username}})
                .then(user => {
                    if (!user){
                        console.log('incorrect username');
                        return done(null, false, {message:'Usuário incorreto!'});

                    }
                    if (!bcrypt.compareSync(password, user.senha)){

                        console.log('incorrect password');
                        return done(null, false, {message:'Senha incorreta!'});

                    }

                    console.log(`user é ${user.usuario}`);
                    return done(null, user);
                })
                .catch(err => done(err));
        }
    ));
}