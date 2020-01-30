'use strict';

const express = require('express');
const checkAuthenticated = require('../routes/login_redirects/checkAuthenticated');
const checkAdmin = require('../routes/login_redirects/checkAdmin');

const router = express.Router();

router.get('/', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('painel', {user: req.user});
});

module.exports = router;