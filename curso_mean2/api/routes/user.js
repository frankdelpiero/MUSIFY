'use strict'

var express = require('express');

var UserController = require('../controlers/user');

//cargo el middleware
var md_auth = require('../miidleware/authenticated');

//Uso el router de express
var api = express.Router();

//Permitir subir archivos al usuario
var multipart = require('connect-multiparty'); // Es un middleware que permite trabajar con la subida de ficheros
var md_upload = multipart({uploadDir:'./uploads/users'});

//Creamos rutas
api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas); //Protego esta ruta
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
//En este caso necesitamos el id pero si quisiesemos un atributo opcional pondriamos un ?
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);//Actualizar recursos 
//Necesario exports api para que sea reconocido

//Subir imagenes
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);//Actualizar una imagen 

api.get('/get-image-user/:imageFile',UserController.getImageFile);//Conseguir la imagen 
module.exports = api;