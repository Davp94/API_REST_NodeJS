'use strict'


var validator = require('validator');
const { validate } = require('../models/artilcle');
var Article = require('../models/artilcle');
var controller = {

    datosPrueba: (req,res)=>{

        return res.status(200).send({
            autor: 'David VIllca',
            email: 'david.villca.pacheco@gmail.com'
        });
    },

    test: (req,res) => {

        return res.status(200).send({
            message: 'Test del controlador'
        });
    },

    save: (req,res) =>{

        //Obtener parametros
        var params = req.body;
        //validar datos
        try{
            var validate_title= !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            })
            
        }

        if(validate_title && validate_content){
            return res.status(200).send({
                message: 'validacion correcta'
            })
        }
        //crear el objeto guardar

        //asignar valores

        //guardar el articulo

        //devolver una respuesta
        return res.status(200).send({
            article: params
        });
    }

};

module.exports = controller;