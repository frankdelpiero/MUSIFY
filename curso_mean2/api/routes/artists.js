'use strict'
var express = require('express'); // Modulo usado para acceder a las rutas
var ArtistController = require('../controlers/artist');
var api = express.Router(); // Nos permite realizar peticiones GET, POST, PUT
var md_auth = require('../miidleware/authenticated'); // Necesario para que solo pueden usarlo los usuarios logueados
//Permitir subir archivos al usuario
var multipart = require('connect-multiparty'); // Es un middleware que permite trabajar con la subida de ficheros
var md_upload = multipart({uploadDir:'./uploads/artists'});
//Rutas
api.get('/artist/:id',md_auth.ensureAuth,ArtistController.getArtist); 
api.get('/artists/:page?',md_auth.ensureAuth,ArtistController.getArtists); //Opcional meter paginacion o no. En el caso de no meterla mostrará la pagina 1
api.post('/artist',md_auth.ensureAuth,ArtistController.saveArtist); 
api.put('/artist/:id',md_auth.ensureAuth,ArtistController.updateArtist); 
api.delete('/artist/:id',md_auth.ensureAuth,ArtistController.deleteArtist);
api.post('/upload-image-artist/:id',[md_auth.ensureAuth,md_upload],ArtistController.uploadImage);//Actualizar una imagen 
api.get('/get-image-artist/:imageFile',ArtistController.getImageFile);//Conseguir la imagen 
//Exporto los datos
module.exports = api;