const express   = require('express');
const authController = require('../controllers/auth')

const routerAuth = express.Router();


routerAuth.post('/register',authController.register);
routerAuth.post('/login',authController.login);
routerAuth.get('/logout', authController.logout);

module.exports = routerAuth;