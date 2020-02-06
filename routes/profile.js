const express = require('express');
const checkAuthenticated = require('./login_redirects/checkAuthenticated');

const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render('minha-conta');
});

module.exports = router;