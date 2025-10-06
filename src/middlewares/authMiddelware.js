const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  // Obtener el token del header Authorization (formato: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer token después de "Bearer "

  if (!token) {
    const error = new Error("Acceso denegado. Token no proporcionado.");
    error.statusCode = 401;
    return next(error);
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const error = new Error("Token inválido o expirado");
      error.statusCode = 403;
      return next(error);
    }

    // Agregar la información del usuario decodificada al request
    req.user = user;
    next(); // Continuar con la siguiente función
  });
};

module.exports = { authenticateToken };