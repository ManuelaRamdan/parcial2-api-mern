const mongoose = require("mongoose");

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String },
  materias: [
    {
      idCurso: { type: mongoose.Schema.Types.ObjectId, ref: "Curso" },
      nombreMateria: { type: String },
      division: { type: String},
      nivel: { type: Number },
      anio: { type: Number },
      profesor: {
        nombre: { type: String }
      },
      notas: [
        {
          tipo: { type: String },
          nota: { type: Number }
        }
      ],
      asistencias: [
        {
          fecha: { type: Date },
          presente: { type: Boolean }
        }
      ],

    }
  ],
  dni: { type: String },
  activo: { type: Boolean, default: true }
});

const Alumno = mongoose.model("Alumno", alumnoSchema);

module.exports = Alumno;
