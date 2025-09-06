const usuarios = [
    {
        id: 1,
        nombre: "Juan Pérez",
        email: "juan.perez@example.com",
        password: "123456", // en la realidad iría hasheada con bcrypt
        rol: "alumno",
        materias: [1, 2] // IDs de materias que cursa
    },
    {
        id: 2,
        nombre: "María Gómez",
        email: "maria.gomez@example.com",
        password: "123456",
        rol: "alumno",
        materias: [2, 3]
    },
    {
        id: 3,
        nombre: "Carlos López",
        email: "carlos.lopez@example.com",
        password: "123456",
        rol: "profe",
        materias: [1, 3] // materias que dicta
    },
    {
        id: 4,
        nombre: "Laura Fernández",
        email: "laura.fernandez@example.com",
        password: "123456",
        rol: "profe",
        materias: [2]
    },
    {
        id: 5,
        nombre: "Admin General",
        email: "admin@example.com",
        password: "admin123",
        rol: "admin",
        materias: []
    }
];

module.exports = usuarios;
