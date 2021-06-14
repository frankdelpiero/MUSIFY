//Se da funcionalidad especial a usuarios
'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso' // Clave secreta para hashear, toma como base esta clave
// Obtendra los datos del usuario y lo guardara dentro del hash

/**
 * Funcion encargada de comprobar si los datos del token son correctos
 * @param {*} req Datos a comprobar
 * @param {*} res Respuesta del servidor
 * @param {*} next Salir de la funcion
 */
exports.ensureAuth = function(req,res,next){

    if (!req.headers.authorization){
        return res.status(403).send({
            message: 'La peticion carece de la cabecera de autenticacion'
        })
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    //Decodificar el token
    try{
        var payload = jwt.decode(token,secret);
        if (payload.exp <= moment().unix()){ // Si la autenticacion ha expirado
            return res.status(401).send({message: 'Token ha expirado'});            
        }

    } catch (ex){
        //console.log(ex);
        return res.status(404).send({message: 'Token invalido'});
    }
    req.user = payload;//Tendremos la informacion del usuario
    next();
};