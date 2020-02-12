'use strict';

const express = require('express');
const products = require('../models').products;
const Favorites = require('../models/Virtual models/favorites');
const checkAuthenticated = require('./login_redirects/checkAuthenticated');

const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render('account/favoritos');
});

router.get('/adicionar-aos-favoritos/:id', checkAuthenticated, (req, res) => {
    const productId = req.params.id;
    let favorites = new Favorites(req.session.favorites ? req.session.favorites : {});

    products.findByPk(productId)
        .then(product => {
            favorites.add(product, product.id);
            req.session.favorites = favorites;

            return res.redirect(`/produtos/${productId}`);
        })
        .catch(err => console.log(err));
});

router.get('/remover-dos-favoritos/:id', checkAuthenticated, (req, res) => {
    const productId = req.params.id;
    let favorites = new Favorites(req.session.favorites ? req.session.favorites : {});

    products.findByPk(productId)
        .then(product => {
            favorites.remove(product.id);

            let favoritesArray = favorites.getArray();

            if (favoritesArray.length === 0) {
                req.session.favorites = undefined;
                return res.redirect('/favoritos');

            } else {
                req.session.favorites = favorites;
                return res.redirect('/favoritos');
            }
            
        })
        .catch(err => console.log(err));
});

module.exports = router;