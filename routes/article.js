'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

//rutas de prueba
router.get('/datos_prueba', ArticleController.datosPrueba);
router.get('/test',ArticleController.test);

//rutas articles
router.post('/save',ArticleController.save);


module.exports = router;
