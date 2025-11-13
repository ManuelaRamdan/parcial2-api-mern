const mongoose = require("mongoose");

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  materias: [
    {
      idCurso: { type: mongoose.Schema.Types.ObjectId, ref: "Curso", required: true },
      nombreMateria: { type: String, required: true },
      division: { type: String, required: true },
      nivel: { type: Number, required: true },
      anio: { type: Number, required: true },
      profesor: {
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

    }
  ],
  dni: { type: String, required: true },
  activo: { type: Boolean, default: true }
});

const Alumno = mongoose.model("Alumno", alumnoSchema);

module.exports = Alumno;
