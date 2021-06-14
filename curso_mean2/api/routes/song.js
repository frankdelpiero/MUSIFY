'use strict'
var express = require('express'); // Modulo usado para acceder a las rutas
var SongController = require('../controlers/song');
var api = express.Router(); // Nos permite realizar peticiones GET, POST, PUT
var md_auth = require('../miidleware/authenticated'); // Necesario para que solo pueden usarlo los usuarios logueados
//Permitir subir archivos al usuario
var multipart = require('connect-multiparty'); // Es un middleware que permite trabajar con la subida de ficheros
var md_upload = multipart({uploadDir:'./uploads/songs'});

api.get('/song/:id',md_auth.ensureAuth,SongController.getSong);
api.get('/songs/:albumId?',md_auth.ensureAuth,SongController.getSongs);
api.post('/song',md_auth.ensureAuth,SongController.saveSong);
api.put('/song/:id',md_auth.ensureAuth,SongController.updateSong);
api.delete('/song/:id',md_auth.ensureAuth,SongController.deleteSong);
api.post('/upload-file-song/:id',[md_auth.ensureAuth,md_upload],SongController.uploadFile);
api.get('/get-song-file/:songFile',SongController.getSongFile);
//Exporto los datos
module.exports = api;