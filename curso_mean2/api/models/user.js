// Fichero usado para la creacion del modelo de datos del usuario

'use strict' // Usar expresiones de JS mas modernas

var mongoose = require('mongoose');

//Creo un objeto de tipo schema que nos pemite guardar colecciones de datos
var Schema =mongoose.Schema; //Defino un esquema de la BD

//Esquema de usuario
//ID generado automaticamente por Mongo
var UserSchema = Schema({
    name: String,
    surname:String,
    email: String,
    password:String,
    role:String,
    image:String
});

//Para usar el objeto fuera del fichero
module.exports = mongoose.model('User',UserSchema);
//Pluraliza el primer parametro