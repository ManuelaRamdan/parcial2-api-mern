const express = require("express");
//const cors = require("cors");
const port = 3000;

const app = express();
//app.use(cors());// Middleware para habilitar CORS -> permite solicitudes desde otros dominios
app.use(express.json()); // Middleware para parsear JSON

// Importar routers
const usuariosRouter = require('./routes/usuarioRoutes');
const materiasRouter = require('./routes/materiaRoutes');

// Usar routers
// app.use es para especificar el middleware como función de devolución de llamada para una ruta específica
//Un middleware es básicamente una función que se ejecuta entre la petición (request) y la respuesta (response).
// Aquí estamos diciendo que todas las rutas que comiencen con /api/usuarios serán manejadas por usuariosRouter

app.use('/api/usuarios', usuariosRouter);
app.use('/api/materias', materiasRouter);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando correctamente!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
