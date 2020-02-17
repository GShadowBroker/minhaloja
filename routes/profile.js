const express = require('express');
const checkAuthenticated = require('./login_redirects/checkAuthenticated');

const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render('account/minha-conta', {classe:'dados'});
});

router.get('/compras', checkAuthenticated, (req, res) => {
    res.render('account/minhas-compras', {classe:'compras'});
});

router.get('/privacidade', checkAuthenticated, (req, res) => {
    res.render('account/privacidade', {classe:'privacidade'});
});

module.exports = router;