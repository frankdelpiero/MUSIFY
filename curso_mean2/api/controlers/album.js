'use strict'
var path = require('path');
var fs = require('fs');

/**
 * Importo los modulos a usar
 */
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination'); // Modulo necesario para realizar la paginacion


/**
 * Conseguimos el album y la informacion del propietario, el artista
 * @param {*} req Album a conseguir
 * @param {*} res Respuesta del servidor
 */
function getAlbum(req, res){
    var albumId = req.params.id;
    // Se usa la funcion populate para recoger informacion del artista que ha publicado
    //ese album
    Album.findById(albumId).populate({path:'artist'}).exec((err,album) =>{
        if (err){
            res.status(500).send({ message:"Error en la petición"});
        } else{
            if (!album){
                res.status(404).send({ message:"El album no existe en la BD"});
            } else{
                res.status(200).send({album});
            }
        }
    });   
}

/**
 * Registro de un album con los parametros pasados por argumentos
 * @param {*} req Datos del album
 * @param {*} res Respuesta del servidor
 */
function saveAlbum(req,res){
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year; // Puede ser que me pida un cast
    album.image = null;
    album.artist = params.artist;
    album.save((err,albumStored) => {
        if (err){
            res.status(500).send({message: 'Error en la peticion'});
        } else{
            if (!albumStored){
                res.status(404).send({message: 'El album no ha sido guardado'}); 
            } else{
                res.status(200).send({album:albumStored});
            }
        }
    });
}


/**
 * Funcion que obtiene un conjunto de albumes ordenados por titulo si pasamos por la URL
 * el ID del artista o en caso de no ponerlo ordenar los albumes por año.
 * Tambien muestra la informacion del artista
 * @param {*} req Datos del album
 * @param {*} res Respuesta del servidor
 */
function getAlbums(req,res){
    var artistId = req.params.artist;
    if (!artistId){
        //Sacar todos los albums de la BD
        var find =Album.find().sort('title');
    } else{
        //Sacar los albums de un artista concreto de la BD
        var find = Album.find({artist:artistId}).sort('year');
    }
    find.populate({path:'artist'}).exec((err,albums)=> {
        if (err){
            res.status(500).send({message: 'Error en la peticion'});            
        } else{
            if (!albums){
                res.status(404).send({message: 'No hay albums'}); 
            } else{
                res.status(200).send({albums});
            }
        }
    })

}

/**
 * Actualiza el album que el usuario ha seleccionado.
 * Para ello, mediante el ID del usuario se actualizará el album en cuestion
 * @param {*} req Datos del album a actualizar
 * @param {*} res Respuesta del servidor
 */
function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndUpdate(albumId,update,(err,albumUpdated) => {
        if (err){
            res.status(500).send({message: 'Error en la peticion'});            
        } else {
            if (!albumUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el album'});
            } else {
                res.status(200).send({album:albumUpdated});
            }
        }
    })
}

/**
 * Funcion que borra un album cuyo ID ha sido pasado por argumentos
 * @param {*} req ID del album a borrar
 * @param {*} res Respuesta del servidor
 */
function deleteAlbum(req,res){
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId,(err,albumRemoved)=> {
        if (err){
            res.status(500).send({message: 'Error en la peticion'});
        } else{
            if (!albumRemoved){
                res.status(404).send({message: 'No se ha podido borrar el album'});
            } else{
              Song.find({album:albumRemoved._id}).remove((err,songRemoved) => {
                if (err){
                    res.status(500).send({message: 'Error en la peticion'});
                } else{
                    if (!songRemoved){
                        res.status(404).send({message: 'No se ha podido borrar las canciones asociadas a este'});
                    } else{
                        res.status(200).send({album:albumRemoved});
                    }
                }
              });  
            }
        }
    });
}

/**
 * Actualiza la imagen del album
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req,res){
    var albumId = req.params.id;
    var file_name = 'Imagen no subida';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/'); //Recorto el path
        var file_name = file_split[2]; //Corresponde al archivo que vamos a subir
        
        //Conseguir el tipo de archivo que estamos subiendo
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId,{image: file_name}, (err,albumUpdated) =>{
                if (err){
                    res.status(500).send({ 
                        message: 'Error al actualizar la imagen del usuario'
                    });
                }
                else{
                    if (!albumUpdated){
                        res.status(404).send({ //Dato no guardado
                            message: 'No se ha podido actualizar la imagen del usuario'
                        });
                    } else{
                        res.status(200).send({album:albumUpdated}); // Devuelve la imagen del usuario actualizada
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
    var path_file = './uploads/albums/'+imageFile;
    fs.exists(path_file, function (exists){
        if (exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'La imagen solicitada no existe'});
        }
    });
}

module.exports= {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}
