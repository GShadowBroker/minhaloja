const express = require('express');
const checkAuthenticated = require('./login_redirects/checkAuthenticated');

const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render('account/minha-conta');
});

router.get('/compras', checkAuthenticated, (req, res) => {
    res.render('account/minhas-compras');
});

module.exports = router;