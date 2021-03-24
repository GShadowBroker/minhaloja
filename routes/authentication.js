"use strict";

const users = require("../models").users;
const checkAuthenticated = require("./login_redirects/checkAuthenticated");
const checkNotAuthenticated = require("./login_redirects/checkNotAuthenticated");
const express = require("express");
const passport = require("passport");
const initialize = require("passport-local");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const csurf = require("csurf");
const csrfMiddleware = csurf({
  cookie: true,
});

const router = express.Router();

router.get("/cadastrar", checkNotAuthenticated, csrfMiddleware, (req, res) => {
  res.render("authentication/cadastro", { csrfToken: req.csrfToken() });
});

router.post(
  "/cadastrar",
  [
    check(
      "usuario",
      "O nome de usuário deve conter somente letras e números, sem espaços."
    ).isAlphanumeric(["pt-BR"]),
    check(
      "usuario",
      "O nome de usuário deve conter entre 2 e 55 caractéres."
    ).isLength({ min: 2, max: 55 }),
    check("usuario", "O nome de usuário deve ser informado.").not().isEmpty(),
    check("usuario").trim().escape(),

    check("email", "O e-mail informado deve ser válido.").isEmail(),
    check(
      "email",
      "O email informado excedeu o máximo de 60 caractéres."
    ).isLength({ max: 60 }),
    check("email").normalizeEmail(),
    check("email").custom(async function (value) {
      const user = await users.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject(
          "Este e-mail já está cadastrado. Se você não se lembra da sua senha, acesse o link 'esqueci minha senha' ou entre em contato conosco."
        );
      }
    }),

    check(
      "senha",
      "A senha deve conter no mínimo 6 caractéres e no máximo 26 caractéres."
    ).isLength({ min: 6, max: 26 }),
    check("senha").custom(function (value, { req }) {
      if (value !== req.body.confirmarSenha) {
        throw new Error("A senha e a confirmação da senha são diferentes.");
      } else return true;
    }),
  ],
  csrfMiddleware,
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("authentication/cadastro", {
        errors: errors.array(),
        csrfToken: req.csrfToken(),
      });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.senha, salt, function (err, hash) {
        return users
          .create({
            usuario: req.body.usuario,
            email: req.body.email,
            senha: hash,
          })
          .then(() => {
            req.flash("contaCriada", "Conta criada com sucesso!");
            res.redirect("/autenticacao/login");
          })
          .catch((err) => console.log(err));
      });
    });
  }
);

router.get("/login", checkNotAuthenticated, csrfMiddleware, (req, res) => {
  res.render("authentication/login", {
    contaCriada: req.flash("contaCriada"),
    message: req.flash("error"),
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/autenticacao/login",
    failureFlash: true,
  })
);

router.get("/logout", checkAuthenticated, (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
