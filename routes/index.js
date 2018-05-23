var express = require('express');
//var basicAuth = require('../auth/basic');
var router = express.Router();
var authConfig = require('../config/auth-config');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', authConfig.localLogin);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', authConfig.localRegister);

// facebook stuff
router.get('/facebook', authConfig.facebookLogin);
router.get('/facebook/callback', authConfig.facebookCallback);

module.exports = router;
