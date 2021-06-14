'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({

    title: String,
    description:String,
    year:Number,
    image:String,
    artist: {type: Schema.ObjectId, ref: 'Artist'} 
    // Guardar un ID  de otro objeto de la BD haciendo referencia a Artist
});


module.exports = mongoose.model('Album',AlbumSchema);