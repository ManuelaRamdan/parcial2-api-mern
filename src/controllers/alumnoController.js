// src/controllers/usuarioController.js
const Alumno = require("../models/alumnoModel");
const { actualizarAlumno } = require("../service/alumnoService");
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
        const actualizarDatos = req.body;

        // Validar que no se modifique curso ni profesor desde aquí
        if (actualizarDatos.curso || actualizarDatos.materias?.some(m => m.profesor)) {
            const error = new Error("No se puede modificar el curso o el nombre del profesor desde el alumno, se debe hacer desde Materias");
            error.statusCode = 422;
            throw error;
        }

        if (Array.isArray(actualizarDatos.materias)) {
            const faltaNombre = actualizarDatos.materias.some(m => !m.nombre);
            if (faltaNombre) {
                const error = new Error("Cada materia que se quiera modificar debe tener el campo 'nombre'");
                error.statusCode = 422;
                throw error;
            }
        }

        const alumnoActualizado = await actualizarAlumno(id, actualizarDatos, next);

        res.json({ message: "Alumno actualizado correctamente", alumno: alumnoActualizado });
    } catch (err) {
        next(err);
    }
};




const deleteAlumno = async (req, res, next) => {
    //cambie el estado a 0 y se sincroniza con el resto
    //solo muestre los alumnos que estan activos
    try {
        const alumno = await Alumno.findByIdAndDelete(req.params.id);
        if (!alumno) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;

        } else {
            res.json({ msg: `Alumno con id ${req.params.id} eliminado correctamente` });
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(err);
    }
};

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    createAlumno,
    updateAlumno,
    deleteAlumno
};
