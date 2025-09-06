const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Importar routers
const usuariosRouter = require('./routes/usuarioRoutes');

// Usar routers
app.use('/api/usuarios', usuariosRouter);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando correctamente!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
