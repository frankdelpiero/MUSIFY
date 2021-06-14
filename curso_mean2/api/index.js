//Fichero de configuracion encargado de realizar la conexion al sistema
//En este caso nos conectamos con MongoDB pero utilizamos el framework Mongoose
'use strict' //Meter instrucciones del estandar de JavaScript

var mongoose = require('mongoose') // Cargo la libreria o modulo

var app = require('./app'); // Cargo la configuracion de APP
// En el primero lo cargo por las variables de entorno y el segundo será el puerto por defecto asignado
var port = process.env.PORT || 3977 

//Realizo la conexion a la base de datos de mongo

//ATENTTION: Si vamos a trabajar con MONGO en el exterior habra que configurar el firewall
mongoose.Promise = global.Promise; // Quito el aviso de Moongose Promise
mongoose.connect('mongodb://localhost:27017/curso_mean2',{useNewUrlParser: true, useUnifiedTopology: true},(err,res) => {
    if (err){
        throw err;
    } else{
        console.log("La conexion a la base de datos está funcionando correctamente...")
        
        //Ponemos el servidor a escuchar
        app.listen(port,function(){
            console.log("Servidor del API REST de música escuchando en http://localhost:"+port);

        })
    }
} );