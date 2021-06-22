'use strict'

const { urlencoded } = require('body-parser');
//cargar modulos de node para crear servidor
var express= require('express');
//Ejecutar express (http)
var app= express();
//Cargar ficheros rutas

//MIddlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//CORS

//Añadir prefijos a rutas 

//rutas de pruebas
app.get('/probando',(req,res)=>{

    return res.status(200).send({
        autor: 'David VIllca',
        email: 'david.villca.pacheco@gmail.com'
    });
});

//Exportar el modulo (este fichero)
module.exports=app;