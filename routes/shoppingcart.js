'use strict';

const express = require('express');
const checkAuthenticated = require('./login_redirects/checkAuthenticated');
const products = require('../models').products;
const Cart = require('../models/Virtual models/cart');
const Favorites = require('../models/Virtual models/favorites');
const axios = require('axios').default;
var parseString = require('xml2js').parseString;

const csurf = require('csurf');
const csrfMiddleware = csurf({
	cookie: true
});

const router = express.Router();


router.get('/', (req, res) => {
    res.render('account/carrinho', {classe:'carrinho', cart: req.session.cart});
});

router.get('/adicionar-ao-carrinho/:id', (req, res) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    products.findByPk(productId)
        .then(product => {
            cart.add(product, product.id);
            req.session.cart = cart;
            res.redirect(`/carrinho`);
        })
        .catch(err => console.log(err));
});

router.get('/remover-do-carrinho/:id', (req, res) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    products.findByPk(productId)
        .then(product => {
            cart.removeOne(product.id);

            if (cart.totalQty === 0) {
                req.session.cart = undefined;
                return res.redirect('/carrinho');

            } else {
                req.session.cart = cart;
                return res.redirect('/carrinho');
            }
            
        })
        .catch(err => console.log(err));
});


router.get('/remover-tudo-do-carrinho/:id', (req, res) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    products.findByPk(productId)
        .then(product => {
            cart.removeAll(product.id);

            if (cart.totalQty === 0) {
                req.session.cart = undefined;
                return res.redirect('/carrinho');

            } else {
                req.session.cart = cart;
                return res.redirect('/carrinho');
            }
            
        })
        .catch(err => console.log(err));
});

router.get('/finalizar-compra', csrfMiddleware, checkAuthenticated, (req, res) => {
    if (!req.session.cart) {
        res.redirect('/');
    }
    res.render('finalizar', {csrfToken: req.csrfToken()});
});

router.post('/finalizar-compra', csrfMiddleware, checkAuthenticated, (req, res) => {

    const email = 'gledysonferreira@gmail.com';
    const token = '8EE04F9C30CA4EAA9B940ACD0B837353';

    const currency = 'BRL';
    const senderName = req.body.nome_completo;
    const senderAreaCode = req.body.codigo_de_area;
    const senderPhone = req.body.telefone;
    const senderCPF = req.body.cpf;
    const senderEmail = req.user.email;
    const shippingType = 1;
    const shippingAddressStreet = req.body.logradouro;
    const shippingAddressNumber = req.body.numero;
    const shippingAddressComplement = req.body.complemento;
    const shippingAddressDistrict = req.body.bairro;
    const shippingAddressPostalCode = req.body.cep;
    const shippingAddressCity = req.body.localidade;
    const shippingAddressState = req.body.uf;
    const shippingAddressCountry = 'BRA';
    const redirectURL = 'https://pt.pornhub.com/'; // xD can't redirect to localhost in production anyway
    const maxUses = 1;
    const maxAge = 3000;

    let link = `https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=${email}&token=${token}`+
                `&currency=${currency}`+
                `&senderName=${senderName}`+
                `&senderAreaCode=${senderAreaCode}`+
                `&senderPhone=${senderPhone}`+
                `&senderCPF=${senderCPF}`+
                `&senderEmail=${senderEmail}`+
                `&shippingType=${shippingType}`+
                `&shippingAddressStreet=${shippingAddressStreet}`+
                `&shippingAddressNumber=${shippingAddressNumber}`+
                `&shippingAddressComplement=${shippingAddressComplement}`+
                `&shippingAddressDistrict=${shippingAddressDistrict}`+
                `&shippingAddressPostalCode=${shippingAddressPostalCode}`+
                `&shippingAddressCity=${shippingAddressCity}`+
                `&shippingAddressState=${shippingAddressState}`+
                `&shippingAddressCountry=${shippingAddressCountry}`+
                `&redirectURL=${redirectURL}`+
                `&maxUses=${maxUses}`+
                `&maxAge=${maxAge}`

    let cart = new Cart(req.session.cart ? req.session.cart : {});
    let carrinho = cart.getArray();

    for (let i=0; i<carrinho.length; i++){
        link += '&itemId' + (i + 1) + '=' + carrinho[i].product.id;
        link += '&itemDescription' + (i + 1) + '=' + carrinho[i].product.name;
        link += '&itemAmount' + (i + 1) + '=' + carrinho[i].price.toFixed(2);
        link += '&itemQuantity' + (i + 1) + '=' + carrinho[i].qty;
        link += '&itemWeight' + (i + 1) + '=' + '1000';
    }

    let url = encodeURI(link);

    axios({
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: url
    })
        .then(xml => {
            parseString(xml.data, function (err, result) {
                const checkout = result.checkout.code[0];
                res.redirect(`https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=${checkout}`);
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;