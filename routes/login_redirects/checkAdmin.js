'use strict';

module.exports = function checkAdmin(req, res, next){
    if (req.user.isAdmin){
        return next();
    }
    return res.redirect('/');
}