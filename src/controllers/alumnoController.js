
const Alumno = require("../models/alumnoModel");
const { actualizarAlumno, agregarAlumnoEnCursos, agregarAlumnoEnProfesores } = require("../service/alumnoService");
const Materia = require("../models/materiaModel");


const paginate = require("../utils/paginar");

const getAllAlumnos = async (req, res, next) => {
    try {
        const result = await paginate(Alumno, req, {
            filter: { activo: true },
            sort: { nombre: 1 }
        });

        res.json({
            alumnos: result.data,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};


const getAlumnoById = async (req, res, next) => {
    try {
        const alumno = await Alumno.findOne({ _id: req.params.id, activo: true });

        if (!alumno) {
            const error = new Error("Alumno no encontrado o inactivo");
            error.statusCode = 404;
            throw error;
        }

        res.json(alumno);
    } catch (err) {
        next(err);
    }
};

const getAlumnoByDni = async (req, res, next) => {
    try {
        const { dni } = req.params;

        // Busca un alumno activo con ese DNI
        const alumno = await Alumno.findOne({ dni, activo: true });

        if (!alumno) {
            const error = new Error("Alumno no encontrado o inactivo");
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


        if (
            materias.some(
                m =>
                    !m.nombre ||
                    !m.curso ||
                    !m.profesor ||
                    !m.profesor.id ||
                    !m.profesor.nombre
            )
        ) {
            const error = new Error(
                "Cada materia debe incluir nombre, curso y profesor (con id y nombre)."
            );
            error.statusCode = 400;
            throw error;
        }

        const filtros = materias.map(m => ({
            nombre: m.nombre,
            curso: m.curso,
            "profesor._id": m.profesor._id
        }));


        const materiasEnBD = await Materia.find({ $or: filtros });

        if (materiasEnBD.length !== materias.length) {
            const faltantes = materias.filter(
                m =>
                    !materiasEnBD.some(
                        db =>
                            db.nombre === m.nombre &&
                            db.curso === m.curso &&
                            db.profesor._id.toString() === m.profesor._id.toString()
                    )
            );

            const nombresFaltantes = faltantes
                .map(f => `${f.nombre} (${f.curso}) - Profesor ${f.profesor.nombre}`)
                .join(", ");

            const error = new Error(
                `Las siguientes materias no existen en la base de datos: ${nombresFaltantes}`
            );
            error.statusCode = 404;
            throw error;
        }

        const materiasAlumno = materias.map(m => ({
            nombre: m.nombre,
            curso: m.curso,
            profesor: { nombre: m.profesor.nombre },
            notas: [],
            asistencias: []
        }));

        const nuevoAlumno = new Alumno({
            nombre,
            dni,
            materias: materiasAlumno,
            activo: true
        });

        await nuevoAlumno.save();

        // Sincronizar en colecciones Materia y Profesor
        await agregarAlumnoEnCursos(nuevoAlumno);
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

        const alumnoActualizado = await actualizarAlumno(id, datosBody);

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
        const alumnoActualizado = await actualizarAlumno(
            req.params.id,
            { activo: false }
        );

        res.json({
            msg: `Alumno con id ${req.params.id} marcado como inactivo correctamente`
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
    deleteAlumno,
    getAlumnoByDni
};
