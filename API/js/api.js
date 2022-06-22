"use strict";
// Con express se pueden acceder a metodos como get y post. nos sirve para crear el api rest y crear un servidor
// cuando se trabaja con angular se instala "npm i --save-dev @types/node" automaticamente
// instalar express, mysql
const express = require('express');
const mysql = require('mysql');
// body parser analiza y modifica el formato original cuando se obtienen los datos de un formulario (o JSON)
// para poder subirlo a la base de datos
const bodyParser = require('body-parser');
const aplicacion = express();
// const servidor="127.0.0.1";
const puerto = 3002;
// configuración de la conexion
let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    password: '',
    database: 'procean'
});
connection.connect(function (error, results, fields) {
    if (error) {
        console.log("falla");
        throw error;
    }
    console.log("todo Bien");
});
//   connection.connect();
//   connection.query('SELECT 1 + 1 AS solution', function (error:any, results:any, fields:any) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//   });
//   connection.end();
aplicacion.use(bodyParser.urlencoded({ extended: false }));
//metodos CRUD , Create==post, READ=GET, UPDATE=PU, DELETE=DELETE
// uno de los metodos de una api rest, get
// req-> peticion y res -> respuesta
aplicacion.get('/', (req, res) => {
    res.send('Hola mundo2!');
});
aplicacion.get('/usuarios', (req, res) => {
    // query -> es un metodo para acceder a las consultas de la base de datos
    connection.query("select * from usuarios", (requirement, response) => {
        //console.log(response);
        //res.send(response);
        res.status(200).send(response);
    });
});
aplicacion.get('/usuarios/:id', (req, res) => {
    let id = req.params.id; // params toma el id del link
    console.log("El id es: ", id);
    // query -> es un metodo para acceder a las consultas de la base de datos
    connection.query("select * from usuarios where usuarios.id = ?", id, (requirement, response) => {
        //console.log(response);
        //res.send(response);
        res.status(200).send(response);
    });
});
// inserción de datos
// los parametros vienen a través de un formulario en los corchetes ("[]")
// no se utiliza req.params porque los datos on se encuentran en la url, está dentro del body
aplicacion.post('/crearUsuarios', (req, res) => {
    // nombre,correo,donacion,apellido es el id del formulario (campo) "formControlName='nombre'"
    let nombre = req.body.nombre;
    let correo = req.body.correo;
    let donacion = req.body.donacion;
    let apellido = req.body.apellido;
    console.log("Correcto: " + nombre + " " + correo);
    connection.query("INSERT INTO `usuarios` (nombre,apellido,correo,donacion) VALUES ('" + nombre + "','" + apellido + "','" + correo + "','" + donacion + "')", (req1, res1) => {
        res.status(201).send("Usuario Creado");
        console.log(res1);
    });
});
//put es para modificara los valores, esto se puede hacer de 2 formas:
// 1ra forma: enviando la id a través de la url
// 2da forma: enviando el dato a traves de un parámetro
//primera forma (el id se pasó a través del url)
aplicacion.put('/modificarUsuarios/:id', (req, res) => {
    let id = req.params.id;
    let nombre = req.body.nombre;
    connection.query("UPDATE `usuarios` SET nombre=? WHERE id=?", [nombre, id], (req1, res1) => {
        res.status(200).send("Usuario Actualizado");
    });
});
// segunda forma
aplicacion.put('/modificarUsuarios2', (req, res) => {
    let id = req.body.id;
    let nombre = req.body.nombre;
    connection.query("UPDATE `usuarios` SET nombre=? WHERE id=?", [nombre, id], (req1, res1) => {
        res.status(200).send("Usuario Actualizado");
    });
});
aplicacion.delete('/eliminarUsuario', (req, res) => {
    let id = req.body.id;
    connection.query("DELETE FROM `usuarios` WHERE id=?", id, (req1, res1) => {
        res.status(200).send("Usuario Eliminado");
    });
});
aplicacion.listen(puerto, () => {
    console.log(`Colo Colo lo más grande servidor escuchando localhost:${puerto}`);
});
