'use strict';

const express = require('express');
const products = require('../models').products;

const router = express.Router();

router.get('/products', (req, res) => {
    products.findAll({
        include: [{all:true}]
    })
        .then(products => {
            res.status(200).send(products);
        })
        .catch(err => res.status(400).send(err));
});

module.exports = router;