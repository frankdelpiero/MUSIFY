//En este fichero se van a configurar cabeceras, configurar bodyparser y se usa express
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas

//Configurar bodyparser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // Convertir a JSON los datos que lleguen por HTTP

// COnfigurar cabeceras
app.use( (req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request');
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');

    next(); //Salir del middleware
});
//rutas base -> Detras de la ruta API va otra configuracion
//Vienen de la carpeta ROUTES
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artists');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

//ruta base. Cada vez que se cree un modulo colocar aqui su uso
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
// Para cualquier solicitud se usara un /api


module.exports = app; // Con esta linea se usa express dentro de otros ficheros que incluyan app
