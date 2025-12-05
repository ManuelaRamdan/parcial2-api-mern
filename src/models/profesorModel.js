const mongoose = require("mongoose");

const profesorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    materiasDictadas: [
        {
            idCurso: { type: mongoose.Schema.Types.ObjectId, ref: "Curso", required: true },
            nombreMateria: { type: String, required: true },
            division: { type: String, required: true },
            nivel: { type: Number, required: true },
            anio: { type: Number, required: true },
            alumnos: [
                {
                    nombre: { type: String, required: true },
                    dni: { type: String, required: true },
                    activo: { type: Boolean, default: true },
                    notas: [
                        {
                            tipo: { type: String, required: true },
                            nota: { type: Number, required: true }
                        }
                    ],
                    asistencias: [
                        {
                            fecha: { type: Date, required: true },
                            presente: { type: String, required: true }
                        }
                    ]
                }
            ]
        }
    ]
});

const Profesor = mongoose.model("Profesores", profesorSchema);

module.exports = Profesor;