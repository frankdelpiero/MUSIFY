'use strict'
var express = require('express'); // Modulo usado para acceder a las rutas
var AlbumController = require('../controlers/album');
var api = express.Router(); // Nos permite realizar peticiones GET, POST, PUT
var md_auth = require('../miidleware/authenticated'); // Necesario para que solo pueden usarlo los usuarios logueados
//Permitir subir archivos al usuario
var multipart = require('connect-multiparty'); // Es un middleware que permite trabajar con la subida de ficheros
var md_upload = multipart({uploadDir:'./uploads/albums'});
api.get('/album/:id',md_auth.ensureAuth,AlbumController.getAlbum);
api.get('/albums/:artist?',md_auth.ensureAuth,AlbumController.getAlbums);
api.post('/album',md_auth.ensureAuth,AlbumController.saveAlbum);
api.put('/album/:id',md_auth.ensureAuth,AlbumController.updateAlbum);
api.delete('/album/:id',md_auth.ensureAuth,AlbumController.deleteAlbum);
api.post('/upload-image-album/:id',[md_auth.ensureAuth,md_upload],AlbumController.uploadImage);//Actualizar una imagen 
api.get('/get-image-album/:imageFile',AlbumController.getImageFile);//Conseguir la imagen 

module.exports = api;