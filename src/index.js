
//dotenv es una dependencia que permite cargar variables de entorno desde un archivo .env
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = 3000;
const connectDB = require("./config/db");

// Importar routers
const usuariosRouter = require('./routes/usuarioRoutes');
//const materiasRouter = require('./routes/materiaRoutes');

const app = express();
app.use(cors());// Middleware para habilitar CORS -> permite solicitudes desde otros dominios
app.use(express.json()); // Middleware para parsear JSON

// Conectar BD
connectDB();


app.use('/api/usuarios', usuariosRouter);
//app.use('/api/materias', materiasRouter);

// Inicio del server
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
