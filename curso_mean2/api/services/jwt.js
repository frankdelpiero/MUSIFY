// Metodos para trabajar con JWT
'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso' // Clave secreta para hashear, toma como base esta clave
// Obtendra los datos del usuario y lo guardara dentro del hash
exports.createToken = function(user){
    var payload = {
        sub: user._id, //Id objeto
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), // Fecha de inicio del token
        exp: moment().add(30,'days').unix() // Fecha de expiracion. En este caso cada 30 dias
    }; // Datos a codificar

    //Token codificado
    return jwt.encode(payload,secret);

};