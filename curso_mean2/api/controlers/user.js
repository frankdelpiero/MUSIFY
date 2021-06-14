'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){

    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios del API REST con Node y Mongo'
    });

}

/**
 * Funcion encargada de registrar nuevos usuarios
 * @param {*} req Datos del usuario a registrar
 * @param {*} res Respuesta del servidot
 */
function saveUser(req,res){
    var user = new User();
    var params = req.body; //parametros

    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password){
        //Encripto contraseña 
        bcrypt.hash(params.password,null,null,function (err,hash){
            user.password = hash; // contrasenia encriptada
            if (user.name != null && user.surname != null && user.email != null){
                //Guardar el usuario
                user.save((err,userStored) => {
                    if (err){
                        res.status(500).send({ //Dato no guardado
                            message: 'Error al guardar el usuario'
                        });
                    }else{
                        if (!userStored){ //Si no se guarda correctamente
                            res.status(404).send({ // No existe
                                message: 'No se ha registrado el usuario'
                            }); 
                        } else{
                            res.status(200).send({
                                user:userStored //Registro correcto
                            });
                        }
                    }
                });
            } else{
                // Faltan datos
                res.status(200).send({
                    message: 'Rellena todos los campos'
                });
            }
        })
    } else{
        res.status(200).send({
            message: 'Introduce la contraseña'
        });
    }
}

/**
 * Funcion encargada de hacer login a un usuario registrado.
 * Se usa un TOKEN JWT para la autentacion del mismo. Tiene una expiracion de 30 dias
 * @param {*} req Datos del usuario
 * @param {*} res Respuesta del servidor
 */
function loginUser(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({email:email.toLowerCase()},(err,user) => { //equivalente function(err, check)
        if (err){
            res.status(500).send({
                message: "Error en la peticion"
            })
        } else{
            if(!user){
                res.status(404).send({
                    message:"El usuario no existe"
                })
            } else{
                //Comprobamos si introdujo bien la contraseña
                bcrypt.compare(password,user.password,function(err,check) {
                    if (check){
                        //Devuelveme los datos del usuario
                        if (params.gethash){
                            //Devolver un token JWT
                            res.status(200).send({
                                token:jwt.createToken(user)
                            });

                        } else{
                            //Indica que el login ha sido correcto
                            res.status(200).send({user});
                        }
                    }
                    else{
                        res.status(404).send({
                            message:"El usuario no ha podido loguerase"
                        })
                    } 
                    
                })
            }
        }
    });
}

/**
 * Funcion encargada de actualizar datos del usuario. No incluye imagenes
 * @param {*} req Datos del usuario
 * @param {*} res Respuesta del servidor
 */
function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body; //Datos a actualizar

    if (userId != req.user.sub){
        return  res.status(500).send({ 
            message: 'Error al actualizar al usuario'
        });
    }
    User.findByIdAndUpdate(userId,update,(err,userUpdated) => {
        if (err){

            res.status(500).send({ 
                message: 'Error al actualizar al usuario'
            });

        } else{
            if (!userUpdated){
                res.status(404).send({ //Dato no guardado
                    message: 'No se ha podido actualizar el usuario'
                });
            } else{
                res.status(200).send({user:userUpdated}); // Devuelve el usuario actualizado
            }
        }

    });

}

/**
 * Funcion encargada de actualizar las imagen de fondo del usuario
 * Sube al servidor las imagenes que el usuario desee
 * ATTENTION: SOLO ADMITE IMAGENES FORMATO JPG, PNG Y GIF
 * @param {*} req Imagen a subir
 * @param {*} res Respuesta del servidor
 */
function uploadImage(req,res){
    var userId = req.params.id;
    var file_name = 'Imagen no subida';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/'); //Recorto el path
        var file_name = file_split[2]; //Corresponde al archivo que vamos a subir
        
        //Conseguir el tipo de archivo que estamos subiendo
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId,{image: file_name}, (err,userUpdated) =>{
                if (err){
                    res.status(500).send({ 
                        message: 'Error al actualizar la imagen del usuario'
                    });
                }
                else{
                    if (!userUpdated){
                        res.status(404).send({ //Dato no guardado
                            message: 'No se ha podido actualizar la imagen del usuario'
                        });
                    } else{
                        res.status(200).send({user:userUpdated}); // Devuelve la imagen del usuario actualizada
                    }
                }
            }); // 
        } else{
            res.status(200).send({message: "Extension no valida"});
        }
    }else{
        res.status(200).send({message: 'No se ha subido ninguna imagen'});
    }
}

/**
 * Consigue la imagen de la galeria de datos
 * @param {*} req Imagen que desea obtener el usuario
 * @param {*} res Respuesta del servidor
 */
function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    fs.exists(path_file, function (exists){
        if (exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'La imagen solicitada no existe'});
        }
    });
}


//Metodos para exportar
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};