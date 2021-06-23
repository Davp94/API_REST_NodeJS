'use strict'


var validator = require('validator');
var fs = require('fs');
var path = require('path');

const { validate, exists } = require('../models/artilcle');
var Article = require('../models/artilcle');
var controller = {

    datosPrueba: (req, res) => {

        return res.status(200).send({
            autor: 'David VIllca',
            email: 'david.villca.pacheco@gmail.com'
        });
    },

    test: (req, res) => {

        return res.status(200).send({
            message: 'Test del controlador'
        });
    },

    save: (req, res) => {

        //Obtener parametros
        var params = req.body;
        //validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })

        }

        if (validate_title && validate_content) {
            //crear el objeto guardar
            var article = new Article();
            //asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            //guardar el articulo
            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado!!!'
                    });
                }
                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                })
            });


        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son nvalidos!!!'
            });
        }


    },

    getArticles: (req, res) => {

        var query = Article.find({});
        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }
        //find
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });

    },

    getArticle: (req, res) => {

        //recoger el id de la url
        var articleId = req.params.id;
        //verificar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }
        //buscar el articulo 
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }
            //devolver el articulo
            return res.status(200).send({
                status: 'success',
                article
            });
        });

    },

    update: (req, res) => {

        //recoger el id del articulo por la url
        var articleId = req.params.id;
        //recoger los datos que llegan
        var params = req.body;
        //validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content) {
            //hacer a consulta find & update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if (!articleUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdate
                });
            })
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }


    },

    delete: (req, res) => {

        //recoger el id de la url
        var articleId = req.params.id;

        // find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, no existe'
                });
            }
            return res.status(200).send({
                status: 'sucess',
                article: articleRemoved
            });
        });

    },

    upload: (req, res) => {

        //recoger el fichero
        var file_name = 'Imagen no subida ...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        //conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        //comprobar la extension, solo imagenes
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            })
        } else {
            var articleId = req.params.id;

            Article.findOneAndUpdate({ _id: articleId }, { image: file_name },
                { new: true }, (err, articleUpdated) => {


                    if(err || !articleUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'error al guardar la imagen'
                        });
                    }
                    return res.status(200).send({
                        status: 'sucess',
                        article: articleUpdated
                    });
                });

        }
        //si todo es valido buscar un articulo y asignar la imagen

    },

    getImage: (req,res)=>{

        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.access(path_file,fs.constants.F_OK,(err)=>{
            if(!err){
                return res.sendFile(path.resolve(path_file));

            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });

            }
        })
    },

    

};

module.exports = controller;