

const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'administrador') {
        const error = new Error("Acceso denegado. Se requieren permisos de administrador");
        error.statusCode = 403;
        return next(error);
    }
    next();
};


const isPadre = (req, res, next) => {
    if (req.user.rol !== 'padre') {
        const error = new Error("Acceso denegado. Se requieren permisos de padre");
        error.statusCode = 403;
        return next(error);
    }
    next();
};

const isProfe = (req, res, next) => {
    if (req.user.rol !== 'profe') {
        const error = new Error("Acceso denegado. Se requieren permisos de profesor");
        error.statusCode = 403;
        return next(error);
    }
    next();
};

module.exports = { isAdmin, isPadre, isProfe };