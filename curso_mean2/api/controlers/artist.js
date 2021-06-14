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
 * Conseguimos el artista
 * @param {*} req Artista a conseguir
 * @param {*} res Respuesta del servidor
 */
function getArtist(req, res){
    var artistId = req.params.id;
    Artist.findById(artistId,(err,artist)=> {
        if (err){
            res.status(500).send({ message:"Error en la petición"});
        } else{
            if(!artist){
                res.status(404).send({ message:"El artista no existe en la BD"});
            } else{
                res.status(200).send({artist});
            }
        }

    });
    
}

/**
 * Guarda el artista en la BD
 * @param {*} req Datos del artista a guardar
 * @param {*} res Respuesta del servidor
 */
function saveArtist(req,res){
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;
    artist.save((err,artistStored)=> {
        if (err){
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if (!artistStored){
                res.status(404).send({message: 'El artista no ha sido guardado'});
            } else{
                res.status(200).send({artist:artistStored});
            }
        }
    });
}

/**
 * Funcion encargada de buscar varios artistas en la base de datos
 * Se usa la paginacion para el caso agrupandolos en grupos segun esta estipulado.
 * @param {*} req 
 * @param {*} res 
 */
function getArtists(req,res){
    if (req.params.page){
        var page = req.params.page;
    } else{
        var page = 1;
    }
        var itemsPerPage = 3; // Artistas que apareceran por paginas

    Artist.find().sort('name').paginate(page,itemsPerPage,function(err,artists,total){
        if (err){
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if (!artists){
                res.status(404).send({message: 'No hay artistas en la BD'});
            } else{
                return res.status(200).send({
                    pages:total,
                    artists:artists
                });
            }
        }
    });

}

/**
 * Actualizar informacion de un artista.
 * En caso de no poder actualizarse, el servidor enviará una peticion negando el trabajo o en
 * caso de haber error alguno
 * @param {*} req Datos a actualizar
 * @param {*} res Respuesta del servidor
 */
function updateArtist(req,res){
    var artistId = req.params.id;
    var update = req.body;
    Artist.findByIdAndUpdate(artistId,update,(err,artistUpdated) =>{
        if (err){
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if (!artistUpdated){
                res.status(404).send({message: "El artista no existe o no se ha podido actualizar"});
            } else{
                res.status(200).send({artist:artistUpdated});
            }
        }
    });
}

/**
 * Funcion que se encarga de borrar los artistas de la aplicacion, asi como sus canciones y albumes asociados a este
 * @param {*} req Datos del artista
 * @param {*} res Respuesta del servidor
 */
function deleteArtist(req,res){
    var artistId= req.params.id;
    Artist.findByIdAndRemove(artistId,(err,artistRemoved) => {
        if (err){
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if (!artistRemoved){
                res.status(404).send({message: "El artista no se ha podido eliminar"});
            } else{
                Album.find({artist:artistRemoved._id}).remove((err,albumRemoved) => {
                    if (err){
                        res.status(500).send({message: "Error en la peticion"});
                    } else{
                        if (!albumRemoved){
                            res.status(404).send({message: "Los albums creados por los artistas no han podido ser borrados"});
                        } else{
                            Song.find({album:albumRemoved._id}).remove((err,songRemoved) => {
                                if (err){
                                    res.status(500).send({message: "Error en la peticion"});
                                } else {
                                    if (!songRemoved){
                                        res.status(404).send({message: "Las canciones asociadas al artista no han podido ser eliminadas"});
                                    } else{
                                        res.status(200).send({artist:artistRemoved});
                                    }
                                }

                            });
                        }
                    }
                });
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
    var artistId = req.params.id;
    var file_name = 'Imagen no subida';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/'); //Recorto el path
        var file_name = file_split[2]; //Corresponde al archivo que vamos a subir
        
        //Conseguir el tipo de archivo que estamos subiendo
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId,{image: file_name}, (err,artistUpdated) =>{
                if (err){
                    res.status(500).send({ 
                        message: 'Error al actualizar la imagen del usuario'
                    });
                }
                else{
                    if (!artistUpdated){
                        res.status(404).send({ //Dato no guardado
                            message: 'No se ha podido actualizar la imagen del usuario'
                        });
                    } else{
                        res.status(200).send({artist:artistUpdated}); // Devuelve la imagen del usuario actualizada
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
    var path_file = './uploads/artists/'+imageFile;
    fs.exists(path_file, function (exists){
        if (exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'La imagen solicitada no existe'});
        }
    });
}



//Exportar las funciones creadas en este modulo
module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};