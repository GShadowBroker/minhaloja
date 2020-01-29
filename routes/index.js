var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.user){
        return res.render('index', {name: null});
    }
    return res.render('index', {name: req.user.usuario});
});

module.exports = router;
