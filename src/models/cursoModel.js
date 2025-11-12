const mongoose = require("mongoose");

const cursoSchema = new mongoose.Schema({
    nombreMateria: { type: String, required: true }, 
    division: { type: String, required: true },      
    nivel: { type: Number, required: true }, 
    anio: { type: Number, required: true },        
    profesor: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Profesor", required: true },
        nombre: { type: String, required: true }
    },
    alumnos: [
        {
            nombre: { type: String, required: true },
            dni: { type: String, required: true },
            activo: { type: Boolean, default: true }
        }
    ]
});

const Curso = mongoose.model("Curso", cursoSchema);
module.exports = Curso;
