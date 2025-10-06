// src/models/usuarioModel.js
//importar mongoose -> librería de Node.js para conectarse y trabajar con bases de datos MongoDB de manera más sencilla y estructurada
const mongoose = require("mongoose");


//schema es la estructura de los documentos en una colección de MongoDB
//definimos los campos que tendrá el documento y sus tipos de datos
//nombre, email, password, rol (padre, profesor, administrador), hijos (array de referencias a los alumnos)

//required: true -> campo obligatorio
//unique: true -> valor único en la colección (no se pueden repetir emails)
//enum -> valores permitidos para el campo rol

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["padre", "profesor", "administrador"], required: true },
  hijos: [{ type: String }] // 
});

// modelo es una clase que usamos para crear y leer documentos en la colección de usuarios
// mongoose.model() recibe como parámetros el nombre del modelo y el schema asociado
// El nombre del modelo se usa para crear la colección en MongoDB (se pluraliza automáticamente)
const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
