[
  {
    "nombre": "Alumno 2",
    "materias": [
      {
        "nombre": "Matemática",
        "profesor": { "nombre": "Profe 1" },
        "notas": [
          { "tipo": "Parcial 1", "nota": { "$numberInt": "9" } },
          { "tipo": "Parcial 2", "nota": { "$numberInt": "8" } },
          { "tipo": "Parcial 3", "nota": { "$numberInt": "7" } },
          { "tipo": "Parcial 4", "nota": { "$numberInt": "6" } },
          { "tipo": "evaluación integradora", "nota": { "$numberInt": "1" } }
        ],
        "asistencias": [
          { "fecha": { "$date": { "$numberLong": "1756684800000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1756771200000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1756857600000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1756944000000" } }, "presente": true }
        ],
        "curso": "1A"
      },
      {
        "profesor": { "nombre": "Profe 3" },
        "nombre": "Lengua",
        "notas": [
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a563" }, "tipo": "Parcial 1", "nota": { "$numberInt": "6" } },
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a564" }, "tipo": "Parcial 2", "nota": { "$numberInt": "7" } },
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a565" }, "tipo": "Parcial 3", "nota": { "$numberInt": "8" } },
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a566" }, "tipo": "Parcial 4", "nota": { "$numberInt": "9" } }
        ],
        "asistencias": [
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a567" }, "fecha": { "$date": { "$numberLong": "1756684800000" } }, "presente": true },
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a568" }, "fecha": { "$date": { "$numberLong": "1756771200000" } }, "presente": true },
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a569" }, "fecha": { "$date": { "$numberLong": "1756857600000" } }, "presente": true },
          { "_id": { "$oid": "68f11ddec0cc4c07e1a4a56a" }, "fecha": { "$date": { "$numberLong": "1756944000000" } }, "presente": true }
        ],
        "curso": "1A"
      }
    ],
    "dni": "22",
    "__v": { "$numberInt": "1" },
    "activo": true
  },
  {
    "nombre": "Alumno 3",
    "materias": [
      {
        "profesor": { "nombre": "Profe 2" },
        "nombre": "Historia",
        "notas": [
          { "tipo": "Parcial 1", "nota": { "$numberInt": "8" } },
          { "tipo": "Parcial 2", "nota": { "$numberInt": "3" } },
          { "tipo": "Parcial 3", "nota": { "$numberInt": "6" } },
          { "tipo": "Parcial 4", "nota": { "$numberInt": "9" } }
        ],
        "asistencias": [
          { "fecha": { "$date": { "$numberLong": "1756684800000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1756771200000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1756857600000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1756944000000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1757030400000" } }, "presente": true }
        ],
        "curso": "1B"
      },
      {
        "nombre": "Geografía",
        "profesor": { "nombre": "Profe 2" },
        "notas": [
          { "tipo": "Parcial 1", "nota": { "$numberInt": "1" } },
          { "tipo": "Parcial 2", "nota": { "$numberInt": "3" } },
          { "tipo": "Parcial 3", "nota": { "$numberInt": "7" } },
          { "tipo": "Parcial 4", "nota": { "$numberInt": "6" } }
        ],
        "asistencias": [
          { "fecha": { "$date": { "$numberLong": "1756684800000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1756810800000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1756900800000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1756944000000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1756720800000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1756810800000" } }, "presente": false }
        ],
        "curso": "1B"
      }
    ],
    "dni": "3",
    "__v": { "$numberInt": "12" },
    "activo": true
  },
  {
    "nombre": "juan",
    "materias": [
      {
        "profesor": { "nombre": "Profe 1" },
        "nombre": "Matemática",
        "notas": [
          { "tipo": "Parcial 1", "nota": { "$numberInt": "8" } },
          { "tipo": "Parcial 2", "nota": { "$numberInt": "7" } },
          { "tipo": "Parcial 3", "nota": { "$numberInt": "4" } },
          { "tipo": "Parcial 4", "nota": { "$numberInt": "6" } },
          { "tipo": "evaluación integradora", "nota": { "$numberInt": "3" } }
        ],
        "asistencias": [
          { "fecha": { "$date": { "$numberLong": "1756684800000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1756771200000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1756857600000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1756944000000" } }, "presente": true }
        ],
        "curso": "1A"
      },
      {
        "nombre": "Lengua",
        "curso": "1A",
        "profesor": { "nombre": "Profe 3" },
        "notas": [
          { "tipo": "Parcial 1", "nota": { "$numberInt": "10" } },
          { "tipo": "Parcial 2", "nota": { "$numberInt": "8" } },
          { "tipo": "Parcial 3", "nota": { "$numberInt": "6" } },
          { "tipo": "Parcial 4", "nota": { "$numberInt": "9" } },
          { "tipo": "evaluación integradora", "nota": { "$numberInt": "1" } },
          { "tipo": "prueba 1", "nota": { "$numberInt": "5" } }
        ],
        "asistencias": [
          { "fecha": { "$date": { "$numberLong": "1736074800000" } }, "presente": false },
          { "fecha": { "$date": { "$numberLong": "1737370800000" } }, "presente": true },
          { "fecha": { "$date": { "$numberLong": "1735815600000" } }, "presente": false }
        ],
      }
    ],
    "dni": "456123",
    "__v": { "$numberInt": "18" },
    "activo": true
  }
]

