'use strict';

const express = require('express');
const checkAuthenticated = require('../routes/login_redirects/checkAuthenticated');
const checkAdmin = require('../routes/login_redirects/checkAdmin');
const { check, validationResult } = require('express-validator');
const manufacturers = require('../models').manufacturers;
const products = require('../models').products;

const csurf = require('csurf');
const csrfMiddleware = csurf({
	cookie: true
});

const router = express.Router();

router.get('/geral', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin/painel', {classe:'geral'});
});

router.get('/adicionar-fabricante', checkAuthenticated, csrfMiddleware, checkAdmin, (req, res) => {
    res.render('admin/adicionar-fabricante', {classe:'fabricante',csrfToken:req.csrfToken()})
});

router.post('/adicionar-fabricante', checkAuthenticated, csrfMiddleware, checkAdmin, (req, res) => {
    let { name } = req.body;

    if (!name){
        errors.push({msg:'Nome do fabricante é obrigatório.'});
    }
    if (name.length > 55){
        errors.push({msg:'O nome do fabricante informado é muito longo.'});
    }

    if (errors.length > 0){
        console.log(errors.array());
        return res.status(422).render('admin/adicionar-fabricante', {classe:'fabricante', errors: errors, csrfToken: req.csrfToken()});
    }
    return manufacturers.create({
        name: req.body.name
    })
        .then(() => {
            res.render('admin/adicionar-fabricante', {classe:'fabricante', alert: 'Fabricante criado com sucesso', csrfToken: req.csrfToken()});
        })
        .catch(err => console.log(err));
});

router.get('/adicionar-produto', checkAuthenticated, csrfMiddleware, checkAdmin, (req, res) => {
    manufacturers.findAll({
        order:[
            ['name','ASC']
        ]
    })
        .then(manufacturersList => {
            res.render('admin/adicionar-produto', {classe:'produto', manufacturersList: manufacturersList, csrfToken: req.csrfToken()});
        })
        .catch(err => console.log(err));
});

router.post('/adicionar-produto', checkAuthenticated, csrfMiddleware, checkAdmin, (req, res) => {
    let errors = [];

    let { image_path, name, discount, price, os, color, displaySize, cpu, ram } = req.body

    if (!image_path){
        errors.push({msg:'O caminho da imagem do produto é obrigatória.'});
    }
    if (image_path.length > 55){
        errors.push({msg:'O nome do arquivo de imagem é muito longo.'});
    }
    if (!name){
        errors.push({msg:'Nome do produto obrigatório.'});
    }
    if (name.length > 55){
        errors.push({msg:'O nome do produto é muito longo.'});
    }
    if (!discount){
        errors.push({msg:"Você deve inserir um desconto. ('0' para nenhum desconto)."});
    }
    if (discount < 0 || discount > 100) {
        errors.push({msg:'O desconto deve estar entre o intervalo de 0 e 100.'})
    }
    if (!price){
        errors.push({msg:'Preço obrigatório.'});
    }
    if (os.length > 55){
        errors.push({msg:'O nome do sistema operacional é muito longo.'});
    }
    if (color.length > 55){
        errors.push({msg:'O nome da cor é muito longo.'});
    }
    if (displaySize.length > 55){
        errors.push({msg:'O campo tamanho de tela informado é muito longo.'});
    }
    if (cpu.length > 55){
        errors.push({msg:'O nome do processador é muito longo.'});
    }
    if (ram.length > 55){
        errors.push({msg:'O nome da memória RAM é muito longo.'});
    }

    // If there are errors
    if (errors.length > 0) {
        console.log(errors);
        res.render('admin/adicionar-produto', {classe:'produto', errors, csrfToken: req.csrfToken()});
    } else {
        manufacturers.findByPk(req.body.manufacturerId)
            .then(manufacturer => {
                products.create({
                    name: req.body.name,
                    image_path: `/images/produtos/${manufacturer.name}/${req.body.image_path}`,
                    discount: req.body.discount,
                    price_cents: req.body.price * 100,
                    os: req.body.os,
                    color: req.body.color,
                    displaySize: req.body.displaySize,
                    cpu: req.body.cpu,
                    ram: req.body.ram,
                    manufacturerId: req.body.manufacturerId
                })
                    .then(product => {
                        console.log(product);
                        res.render('admin/adicionar-produto', {classe:'produto', alert:'Produto criado com sucesso!', csrfToken: req.csrfToken()});
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
});

router.get('/permissoes', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('admin/gerenciar-permissoes', {classe:'permissoes'});
});

module.exports = router;