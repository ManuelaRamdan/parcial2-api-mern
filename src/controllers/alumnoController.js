
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

        // --- 1. VALIDACIÓN INICIAL DE DATOS OBLIGATORIOS (SIN CAMBIOS) ---
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

        // --- 2. VALIDACIÓN DE ESTRUCTURA DE MATERIA (MODIFICADA) ---
        // Ahora solo validamos que se envíen datos de curso (idCurso o los 4 campos)
        const materiaInvalida = materias.find(m => {
            return (
                !m.idCurso &&
                (!m.nombreCurso || !m.division || !m.nivel || !m.anio)
            );
        });

        if (materiaInvalida) {
            const error = new Error(
                "Cada materia debe incluir idCurso o los campos nombreCurso, division, nivel y anio."
            );
            error.statusCode = 400;
            throw error;
        }

        // --- 3. CREACIÓN DE FILTROS (MODIFICADA: IGNORAMOS EL PROFESOR ENVIADO) ---
        const filtros = materias.map(m => {
            return m.idCurso
                ? { _id: m.idCurso }
                : {
                    nombreCurso: m.nombreCurso,
                    division: m.division,
                    nivel: m.nivel,
                    anio: m.anio,
                    // *** Importante: Eliminamos el filtro por "profesor._id" del input del usuario ***
                };
        });

        // Buscamos los cursos en la BD
        const materiasEnBD = await Curso.find({ $or: filtros });

        // --- 4. VALIDACIÓN DE CURSOS ENCONTRADOS (AJUSTADA) ---
        if (materiasEnBD.length !== materias.length) {
            // Lógica para encontrar qué cursos faltan (usando solo campos de curso)
            const faltantes = materias.filter(m => {
                return !materiasEnBD.some(db =>
                    m.idCurso
                        ? db._id.toString() === m.idCurso // Comparación por ID
                        : (
                            db.nombreCurso === m.nombreCurso &&
                            db.division === m.division &&
                            db.nivel === m.nivel &&
                            db.anio === m.anio
                            // No es necesario comparar el profesor aquí
                        )
                );
            });

            // Mensaje de error (usando los datos enviados)
            const nombresFaltantes = faltantes
                .map(f =>
                    f.idCurso
                        ? `ID ${f.idCurso}`
                        : `${f.nombreCurso} (${f.division}, nivel ${f.nivel}, año ${f.anio})`
                )
                .join(", ");

            const error = new Error(
                `Las siguientes materias no existen en la base de datos: ${nombresFaltantes}`
            );
            error.statusCode = 404;
            throw error;
        }

        // --- 5. CREACIÓN DEL OBJETO MATERIASALUMNO (SOLUCIÓN AL PROBLEMA 1 y 2) ---
        const materiasAlumno = materiasEnBD.map(dbMat => {
            return {
                idCurso: dbMat._id,
                nombreCurso: dbMat.nombreMateria, // ✅ Se guarda el nombre correctamente
                division: dbMat.division,
                nivel: dbMat.nivel,
                anio: dbMat.anio,
                profesor: { 
                    nombre: dbMat.profesor.nombre, // ✅ Se usa el nombre del profesor REAL del curso
                    _id: dbMat.profesor._id // Asegúrate de que el campo _id del profesor también esté en el schema de Curso si lo necesitas
                },
                notas: [],
                asistencias: []
            };
        });

        // --- 6. CREACIÓN Y GUARDADO DEL ALUMNO (SOLUCIÓN AL PROBLEMA 3) ---
        const nuevoAlumno = new Alumno({
            nombre,
            dni,
            materias: materiasAlumno,
            activo: true
        });

        await nuevoAlumno.save();

        await agregarAlumnoEnCursos(nuevoAlumno);
        await agregarAlumnoEnProfesores(nuevoAlumno);

        // Mensaje de Éxito: Solución al problema 3: "no dice 'alumno creado con exito'"
        // Este mensaje será capturado por el componente de creación en el front-end.
        res.status(201).json({
            message: "✅ Alumno creado correctamente y sincronizado.", 
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
