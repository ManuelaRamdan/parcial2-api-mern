const mongoose = require("mongoose");

const profesorSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    nombre: { type: String, required: true },
    materiasDictadas: [
        {
            materiaId: { type: mongoose.Schema.Types.ObjectId, ref: "Materia", required: true },
            nombre: { type: String, required: true },
            cursos: [{ type: String, required: true }]
        }
    ]
});

const Profesor = mongoose.model("Profesor", profesorSchema);

module.exports = Profesor;