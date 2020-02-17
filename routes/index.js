'use strict';
const express = require('express');
const products = require('../models').products;
const { Op } = require('sequelize');

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

router.get('/pesquisar', (req, res) => {
    products.findAll({
        where: {
            name: {
                [Op.iLike]: `%${req.query.name}%`
            }
        },
        include: [{all:true}],
        limit: 10
    })
        .then(results => {
            res.render('resultados-pesquisa', { results });
        })
        .catch(err => console.log(err));
});

module.exports = router;
