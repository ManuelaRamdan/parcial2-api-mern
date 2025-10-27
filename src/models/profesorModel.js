const mongoose = require("mongoose");

const profesorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    materiasDictadas: [
        {
            nombre: { type: String, required: true },
            curso: { type: String, required: true },
            alumnos: [
                {
                    nombre: { type: String, required: true },
                    dni: { type: String, required: true },
                    notas: [
                        {
                            tipo: { type: String, required: true },
                            nota: { type: Number, required: true }
                        }
                    ],
                    asistencias: [
                        {
                            fecha: { type: Date, required: true },
                            presente: { type: Boolean, required: true }
                        }
                    ]
                }
            ]
        }
    ]
});

const Profesor = mongoose.model("Profesores", profesorSchema);

module.exports = Profesor;