const mongoose = require("mongoose");

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  curso: { type: String, required: true },
  materias: [
    {
      materiaId: { type: mongoose.Schema.Types.ObjectId, ref: "Materia", required: true },
      nombre: { type: String, required: true },
      profesor: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Profesor", required: true },
        nombre: { type: String, required: true }
      },
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
      ],
      dni:{ type: String, required: true}
    }
  ]
});

const Alumno = mongoose.model("Alumno", alumnoSchema);

module.exports = Alumno;
