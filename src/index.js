
//dotenv es una dependencia que permite cargar variables de entorno desde un archivo .env
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = 3000;
const connectDB = require("./config/db");

// Importar routers
const usuariosRouter = require('./routes/usuarioRoutes');
const materiasRouter = require('./routes/materiaRoutes');
const alumnoRouter = require('./routes/alumnoRoutes');
const profesorRouter = require('./routes/profesorRoutes');
const padreRouter = require('./routes/padreRoutes');

const app = express();
app.use(cors());// Middleware para habilitar CORS -> permite solicitudes desde otros dominios
app.use(express.json()); // Middleware para parsear JSON

// Conectar BD
connectDB();


app.use('/api/usuarios', usuariosRouter);
app.use('/api/materias', materiasRouter);
app.use('/api/alumnos', alumnoRouter);
app.use('/api/profesores',profesorRouter );
app.use('/api/padre',padreRouter );

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler); // Middleware para manejo de errores

// Inicio del server
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
