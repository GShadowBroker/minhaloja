'use strict';

const express = require('express');
const products = require('../models').products;

const csurf = require('csurf');
const csrfMiddleware = csurf({
	cookie: true
});
const router = express.Router();

router.get('/', csrfMiddleware, (req, res) => {
    res.send('Produtos!', {csrfToken: req.csrfToken()});
});

router.get('/:id', csrfMiddleware, (req, res) => {
    return products.findOne({
        where: {id: req.params.id},
        include: [{all:true}]
    })
        .then(product => {
            res.render('detalhe-produto', {product: product, csrfToken: req.csrfToken()});
        })
        .catch(err => console.log(err));
});

module.exports = router;