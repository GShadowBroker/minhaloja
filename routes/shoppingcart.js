'use strict';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const checkAuthenticated = require('./login_redirects/checkAuthenticated');
const products = require('../models').products;
const users = require('../models').users;
const Cart = require('../models/Virtual models/cart');
const Favorites = require('../models/Virtual models/favorites');
const axios = require('axios').default;
const parseString = require('xml2js').parseString;
const { check, validationResult } = require('express-validator');

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

router.post('/finalizar-compra', csrfMiddleware, checkAuthenticated, [
    check('nome_completo','Nome inválido').isLength({min:2,max:100}),
    check('nome_completo').trim().escape(),

    check('cpf','Número de CPF inválido').isLength(11),
    check('cpf').isNumeric(),

    check('cep','CEP inválido').isLength({min:7,max:10}),
    check('cep','O CEP deve conter apenas valores numéricos').isNumeric(),

    check('uf','Estado inválido').isAlpha(),
    check('uf','Estado inválido').isLength(2),

    check('localidade','A cidade deve conter no mínimo 2 caractéres e no máximo 55 caractéres').isLength({min:2,max:55}),
    check('localidade').trim().escape(),

    check('logradouro','O logradouro deve conter entre 2 e 100 caractéres').isLength({min:2,max:100}),
    check('logradouro').trim().escape(),

    check('numero','O número informado deve conter apenas números').isNumeric(),
    check('numero','O número informado deve conter entre 1 e 6 caractéres').isLength({min:1,max:6}),

    check('bairro','O bairro deve conter entre 2 e 55 caractéres').isLength({min:2,max:55}),
    check('bairro').trim().escape(),

    check('complemento','O complemento deve conter no máximo 55 caractéres').isLength({max:55}),
    check('complemento').trim().escape(),

    check('codigo_de_area','Código de área inválido').isNumeric(),
    check('codigo_de_area','Código de área inválido').isLength(2),

    check('telefone','O número de telefone deve conter apenas números sem caractéres especiais').isNumeric(),
    check('telefone','Número de telefone inválido').isLength({min:7,max:10}),
    check('telefone').trim().escape(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(422).render('finalizar', { errors: errors.array(),csrfToken: req.csrfToken() });
    }

    const telefone = req.body.codigo_de_area.toString() + req.body.telefone.toString();

    users.update({
        nome_completo: req.body.nome_completo,
        cpf:req.body.cpf,
        cep:req.body.cep,
        logradouro:req.body.logradouro,
        complemento:req.body.complemento,
        bairro:req.body.bairro,
        localidade:req.body.localidade,
        uf:req.body.uf,
        telefone:parseInt(telefone)
    },{
        where: {
            id: req.user.id
        }
    })
        .then(user => {

            const email = process.env.MY_EMAIL;
            const token = process.env.PAGSEGURO_TOKEN;

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
            const redirectURL = 'https://www.minhaloja.com.br/minhaconta/minhascompras'; // PLACEHOLDER! Change in production.
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

        })
        .catch(err => console.log(err));
});

module.exports = router;