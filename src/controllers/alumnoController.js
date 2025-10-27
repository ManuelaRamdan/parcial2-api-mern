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
    //que se ponga el alumno a las materias y profesores con esas meterias
    try {
        const { nombre, dni, curso } = req.body;

        if (!nombre || !dni || !curso) {
            const error = new Error("Faltan datos obligatorios: nombre, dni o curso.");
            error.statusCode = 400;
            throw error;
        }

        const alumnoExistente = await Alumno.findOne({ dni });
        if (alumnoExistente) {
            const error = new Error(`Ya existe un alumno registrado con el DNI ${dni}.`);
            error.statusCode = 409; // 409 = Conflicto (recurso duplicado)
            throw error;
        }

        // Buscar las materias del curso
        const materiasCurso = await Materia.find({ curso });

        if (!materiasCurso.length) {
            const error = new Error(`No se encontraron materias para el curso ${curso}.`);
            error.statusCode = 404;
            throw error;
        }

        // Crear la estructura de materias para el alumno
        const materiasAlumno = materiasCurso.map(materia => ({
            nombre: materia.nombre,
            profesor: {
                nombre: materia.profesor?.nombre || "Sin asignar"
            },
            notas: [],
            asistencias: []
        }));

        // Crear y guardar el alumno
        const nuevoAlumno = new Alumno({
            nombre,
            dni,
            curso,
            materias: materiasAlumno
        });

        await nuevoAlumno.save();

        await agregarAlumnoEnMaterias(nuevoAlumno);
        await agregarAlumnoEnProfesores(nuevoAlumno);

        // 201 -> Petición exitosa. Se ha creado un nuevo recurso
        res.status(201).json({
            message: "Alumno creado correctamente",
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

/*const updateNotasAsistencias = async (req, res, next) => {
    try {
        const { id, materiaid, curso } = req.params;
        const { nuevaNota, nuevaAsistencia } = req.body;
        const profesorNombre = req.user.nombre;

        const alumno = await Alumno.findById(id);
        if (!alumno){
            const error = new Error("Alumno no encontrado" );
            error.statusCode = 404;
            throw error;
        }

        const materia = alumno.materias.find(
        (m) =>
            m._id.toString() === materiaid &&
            m.curso === curso &&
            m.profesor.nombre === profesorNombre
        );

        if (!materia)
        {
            const error = new Error("No autorizado o materia/curso incorrecto");
            error.statusCode = 403;
            throw error;
        }

        // Si se envía una nueva nota
        if (nuevaNota) {
            const existente = materia.notas.find((n) => n.tipo === nuevaNota.tipo);
            if (existente) existente.nota = nuevaNota.nota;
            else materia.notas.push(nuevaNota);
        }

        // Si se envía una nueva asistencia
        if (nuevaAsistencia) {
            materia.asistencias.push(nuevaAsistencia);
        }

        await alumno.save();
        res.json({ msg: "Actualización exitosa", alumno });
    } catch (err) {
        next(err);
    }
};*/


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
