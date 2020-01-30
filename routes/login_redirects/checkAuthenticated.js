'use strict';

module.exports = function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    return res.redirect('/autenticacao/login');
}