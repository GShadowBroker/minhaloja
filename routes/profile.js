const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('minha-conta', {user:req.user, name:req.user.usuario});
});

module.exports = router;