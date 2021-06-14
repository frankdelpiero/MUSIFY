'use strict'
var path = require('path');
var fs = require('fs');

/**
 * Importo los modulos a usar
 */
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){
    var songId = req.params.id;
    Song.findById(songId).populate({path:'album'}).exec((err,song) => {
        if (err){
            res.status(500).send({ message:"Error en la petición"});
        } else{
            if (!song){
                res.status(404).send({message: 'No se ha encontrado la cancion'});
            } else{
                res.status(200).send({song});
            }
        }
    });

}

function saveSong(req,res){
    var song = new Song();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;
    song.save((err,songStored)=> {
        if (err){
            res.status(500).send({message: "Error en la peticion"});
        } else {
            if (!songStored){
                res.status(404).send({message: 'La cancion no ha podido ser guardada'});
            } else{
                res.status(200).send({song:songStored});
            }
        }
    });

}

function getSongs(req,res){
    var albumId = req.params.id;
    if (!albumId){
        var find = Song.find({}).sort('number');
    } else{
        var find = Song.find({album:albumId}).sort('number');
    }
    // En este metodo buscaremos tanto pot album como por artistas
    find.populate({
    path:'album',
    populate:{
        path:'artist',
        model:'Artist'
    }      
    }).exec((err,songs)=> {
        if (err){
            res.status(500).send({message: 'Error en la peticion'});            
        } else{
            if (!songs){
                res.status(404).send({message: 'No se encontro referencia de lo que busca'}); 
            } else{
                res.status(200).send({songs});
            }
        }
    })
}

function updateSong(req,res){
    var songId = req.params.id;
    var update = req.body;
    Song.findByIdAndUpdate(songId,update,(err,songUpdated) =>{
            if (err){
                res.status(500).send({message: 'Error en la peticion'});            
            } else{
                if (!songUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar la cancion'}); 
                } else{
                    res.status(200).send({song:songUpdated});
                }
            }
    });
}

function deleteSong(req,res){
    var songId = req.params.id;
    Song.findByIdAndRemove(songId,(err,songRemoved)=> {
        if (err){
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!songRemoved){
                res.status(404).send({message: 'No se ha podido borrar la cancion'}); 
            } else {
                res.status(200).send({song:songRemoved});
            }
        }
    });
}

function uploadFile(req,res){
    var songId = req.params.id;
    var file_name = "No subido..";
    
    if (req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('/'); //Recorto el path
        var file_name = file_split[2]; //Corresponde al archivo que vamos a subir
        
        //Conseguir el tipo de archivo que estamos subiendo
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'mp4' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId,{file:file_name},(err,songUpdated)=>{
                if (err){
                    res.status(500).send({message: 'Error en la peticion'});
                } else {
                    if (!songUpdated){
                        res.status(404).send({message: 'No se ha podido añadir el archivo de musica a la cancion'});  
                    } else {
                        res.status(200).send({song:songUpdated});
                    }
                }
            });
        } else {
            res.status(200).send({message :'Extension de archivo no valida.Esta aplicacion solo permite archivos  con extension MP3,MP4,OGG'});
        }
    } else{
        res.status(200).send({message :'Archivo no subido'});
    }
}

function getSongFile(req,res){
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;
    fs.exists(path_file, function (exists){
        if (exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'La cancion solicitada no existe'});
        }
    });
}


//Exportar las funciones creadas en este modulo
module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}