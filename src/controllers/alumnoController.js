
const Alumno = require("../models/alumnoModel");
const { actualizarAlumno, agregarAlumnoEnCursos, agregarAlumnoEnProfesores } = require("../service/alumnoService");
const Curso = require("../models/cursoModel");


const paginate = require("../utils/paginar");

const getAllAlumnos = async (req, res, next) => {
    try {
        const result = await paginate(Alumno, req, {
            query: { activo: true },
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

        const alumnoExistente = await Alumno.findOne({ dni });
        if (alumnoExistente) {
            const error = new Error(`Ya existe un alumno registrado con el DNI ${dni}.`);
            error.statusCode = 409;
            throw error;
        }

        const materiaInvalida = materias.find(m => {
            return (
                !m.profesor ||
                !m.profesor._id ||
                !m.profesor.nombre ||
                (
                    !m.idCurso &&
                    (!m.nombreCurso || !m.division || !m.nivel || !m.anio)
                )
            );
        });

        if (materiaInvalida) {
            const error = new Error(
                "Cada materia debe incluir profesor (con _id y nombre) y al menos idCurso o los campos nombreCurso, division, nivel y anio."
            );
            error.statusCode = 400;
            throw error;
        }

        const filtros = materias.map(m => {
            return m.idCurso
                ? { _id: m.idCurso }
                : {
                    nombreCurso: m.nombreCurso,
                    division: m.division,
                    nivel: m.nivel,
                    anio: m.anio,
                    "profesor._id": m.profesor._id
                };
        });

        const materiasEnBD = await Curso.find({ $or: filtros });

        if (materiasEnBD.length !== materias.length) {
            const faltantes = materias.filter(m => {
                return !materiasEnBD.some(db =>
                    m.idCurso
                        ? db._id.toString() === m.idCurso
                        : (
                            db.nombreCurso === m.nombreCurso &&
                            db.division === m.division &&
                            db.nivel === m.nivel &&
                            db.anio === m.anio &&
                            db.profesor._id.toString() === m.profesor._id.toString()
                        )
                );
            });

            const nombresFaltantes = faltantes
                .map(f =>
                    f.idCurso
                        ? `ID ${f.idCurso}`
                        : `${f.nombreCurso} (${f.division}, nivel ${f.nivel}, año ${f.anio}) - Profesor ${f.profesor.nombre}`
                )
                .join(", ");

            const error = new Error(
                `Las siguientes materias no existen en la base de datos: ${nombresFaltantes}`
            );
            error.statusCode = 404;
            throw error;
        }

        const materiasAlumno = materiasEnBD.map(dbMat => {
            return {
                idCurso: dbMat._id,
                nombreCurso: dbMat.nombreCurso,
                division: dbMat.division,
                nivel: dbMat.nivel,
                anio: dbMat.anio,
                profesor: { nombre: dbMat.profesor.nombre },
                notas: [],
                asistencias: []
            };
        });

        const nuevoAlumno = new Alumno({
            nombre,
            dni,
            materias: materiasAlumno,
            activo: true
        });

        await nuevoAlumno.save();

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
