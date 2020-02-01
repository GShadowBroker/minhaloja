'use strict';

const express = require('express');
const products = require('../models').products;

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Produtos!');
});

router.get('/:id', (req, res) => {
    return products.findOne({
        where: {id: req.params.id},
        include: [{all:true}]
    })
        .then(product => {
            res.render('detalhe-produto', {user: req.user, product: product});
        })
        .catch(err => console.log(err));
});

module.exports = router;