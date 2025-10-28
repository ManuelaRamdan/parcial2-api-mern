// src/controllers/usuarioController.js
const Alumno = require("../models/alumnoModel");
const { actualizarAlumno, agregarAlumnoEnMaterias, agregarAlumnoEnProfesores } = require("../service/alumnoService");
const Materia = require("../models/materiaModel");


const paginate = require("../utils/paginar");

const getAllAlumnos = async (req, res, next) => {
    try {
        const result = await paginate(Alumno, req, { sort: { nombre: 1 } });
        res.json({
            alumnos: result.data,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};




//404 -> El servidor no pudo encontrar el contenido solicitado

const getAlumnoById = async (req, res, next) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.json(alumno);


    } catch (err) {
        next(err);

    }
};


const createAlumno = async (req, res, next) => {
    try {
        const { nombre, dni, materias } = req.body;
        console.log(req.body);
        if (!nombre || !dni || !Array.isArray(materias) || materias.length === 0) {
            const error = new Error("Faltan datos obligatorios: nombre, dni o materias.");
            error.statusCode = 400;
            throw error;
        }

        // Verificar duplicado de DNI
        const alumnoExistente = await Alumno.findOne({ dni });
        if (alumnoExistente) {
            const error = new Error(`Ya existe un alumno registrado con el DNI ${dni}.`);
            error.statusCode = 409;
            throw error;
        }

        // Validar que todas las materias existan en la BD
        const nombresMaterias = materias.map(m => m.nombre);
        const cursosMaterias = materias.map(m => m.curso);

        const materiasEnBD = await Materia.find({
            nombre: { $in: nombresMaterias },
            curso: { $in: cursosMaterias }
        });

        if (materiasEnBD.length !== materias.length) {
            const faltantes = materias.filter(m =>
                !materiasEnBD.some(db => db.nombre === m.nombre && db.curso === m.curso)
            );
            const nombresFaltantes = faltantes.map(f => `${f.nombre} (${f.curso})`).join(", ");
            const error = new Error(`Las siguientes materias no existen: ${nombresFaltantes}`);
            error.statusCode = 404;
            throw error;
        }

        // Crear la estructura interna del alumno
        const materiasAlumno = materias.map(m => ({
            nombre: m.nombre,
            curso: m.curso, 
            profesor: { nombre: m.profesor?.nombre || "Sin asignar" },
            notas: [],
            asistencias: []
        }));

        // Crear el documento del alumno
        const nuevoAlumno = new Alumno({
            nombre,
            dni,
            materias: materiasAlumno,
            activo: true
        });

        await nuevoAlumno.save();

        // Sincronizar en colecciones Materia y Profesor
        await agregarAlumnoEnMaterias(nuevoAlumno);
        await agregarAlumnoEnProfesores(nuevoAlumno);

        res.status(201).json({
            message: "Alumno creado correctamente y sincronizado",
            alumno: nuevoAlumno
        });
    } catch (err) {
        next(err);
    }
};


const updateAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const datosBody = req.body;

        // Validación básica: debe haber al menos un campo para actualizar
        if (
            !datosBody.dni &&
            !datosBody.nombre &&
            datosBody.activo === undefined &&
            !Array.isArray(datosBody.materias)
        ) {
            const error = new Error("No hay datos para actualizar");
            error.statusCode = 422;
            throw error;
        }

        // Llamada al servicio
        const alumnoActualizado = await actualizarAlumno(id, datosBody, next);

        res.json({
            message: "Alumno actualizado correctamente",
            alumno: alumnoActualizado,
        });
    } catch (err) {
        next(err);
    }
};




const deleteAlumno = async (req, res, next) => {
    try {
        // Llamamos a actualizarAlumno, pasándole el campo activo: false
        const alumnoActualizado = await actualizarAlumno(
            req.params.id,
            { activo: false },
            next
        );

        res.json({
            msg: `Alumno con id ${req.params.id} marcado como inactivo correctamente`,
            alumno: alumnoActualizado
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    createAlumno,
    updateAlumno,
    //updateNotasAsistencias,
    deleteAlumno
};
