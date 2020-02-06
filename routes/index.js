'use strict';
const express = require('express');
const products = require('../models').products;

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    products.findAll({
        include:[{all:true}]
    })
        .then(products => {
            return res.render('index', {products});
        })
        .catch(err => console.log(err));
});

module.exports = router;
