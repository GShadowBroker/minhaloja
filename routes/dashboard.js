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

router.get('/', checkAuthenticated, csrfMiddleware, checkAdmin, (req, res) => {
    manufacturers.findAll({
        order:[
            ['name','ASC']
        ]
    })
        .then(manufacturersList => {
            res.render('painel', {manufacturersList: manufacturersList, csrfToken: req.csrfToken()});
        })
        .catch(err => console.log(err));
});

router.post('/', csrfMiddleware, (req, res) => {

    let errors = [];

    if (req.body.price){

        let { image_path, name, price, os, color, displaySize, cpu, ram } = req.body

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
            res.render('painel', {errors, csrfToken: req.csrfToken()});
        } else {
            manufacturers.findByPk(req.body.manufacturerId)
                .then(manufacturer => {
                    products.create({
                        name: req.body.name,
                        image_path: `/images/produtos/${manufacturer.name}/${req.body.image_path}`,
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
                            res.render('painel', {alert:'Produto criado com sucesso!', csrfToken: req.csrfToken()});
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
    } else {

        let { name } = req.body;

        if (!name){
            errors.push({msg:'Nome do fabricante é obrigatório.'});
        }
        if (name.length > 55){
            errors.push({msg:'O nome do fabricante informado é muito longo.'});
        }

        if (errors.length > 0){
            console.log(errors.array());
            return res.status(422).render('painel', {errors: errors, csrfToken: req.csrfToken()});
        }
        return manufacturers.create({
            name: req.body.name
        })
            .then(manufacturer => {
                res.render('painel', {alert: 'Fabricante criado com sucesso', csrfToken: req.csrfToken()});
            })
            .catch(err => console.log(err));
    }
});

module.exports = router;