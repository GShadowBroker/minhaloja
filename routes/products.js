'use strict';

const express = require('express');
const products = require('../models').products;
const manufacturers = require('../models').manufacturers;

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

router.get('/fabricantes/:fabricante', (req, res) => {
    const manufacturerName =  req.params.fabricante.charAt(0).toUpperCase() + req.params.fabricante.substring(1);

    manufacturers.findOne({
        where: {name: manufacturerName}
    })
        .then(manufacurer => {

            if (!manufacurer){
                return res.render('resultados-pesquisa', {results:null});
            }

            products.findAll({
                where: {manufacturerId: manufacurer.id},
                include: [{all:true}]
            })
                .then(results => {
                    return res.render('resultados-pesquisa', {results});
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

module.exports = router;