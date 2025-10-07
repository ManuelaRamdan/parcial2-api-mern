[
  {
    "_id": { "$oid": "68de80593d1ddd3fd29ddc60" },
    "nombre": "Alumno 1",
    "curso": "1A",
    "materias":
      [{
        "nombre": "Matemática",
        "profesor": { "nombre": "Profe 1" },
        "notas":
          [{
            "tipo": "Parcial 1",
            "nota": { "$numberInt": "8" }
          },
          {
            "tipo": "Parcial 2",
            "nota": { "$numberInt": "7" }
          }, {
            "tipo": "Parcial 3",
            "nota": { "$numberInt": "9" }
          }, {
            "tipo": "Parcial 4",
            "nota": { "$numberInt": "6" }
          }],
        "asistencias":
          [{
            "fecha": "2025-09-01",
            "presente": true
          }, {
            "fecha": "2025-09-02",
            "presente": true
          }, {
            "fecha": "2025-09-03",
            "presente": false
          }, {
            "fecha": "2025-09-04",
            "presente": true
          }]
      }, {
        "nombre": "Lengua",
        "profesor": { "nombre": "Profe 3" },
        "notas":
          [{
            "tipo": "Parcial 1",
            "nota": { "$numberInt": "7" }
          }, {
            "tipo": "Parcial 2",
            "nota": { "$numberInt": "8" }
          }, {
            "tipo": "Parcial 3",
            "nota": { "$numberInt": "6" }
          }, {
            "tipo": "Parcial 4",
            "nota": { "$numberInt": "9" }
          }],
        "asistencias":
          [{
            "fecha": "2025-09-01",
            "presente": true
          },
          {
            "fecha": "2025-09-02",
            "presente": true
          }, {
            "fecha": "2025-09-03",
            "presente": true
          }, {
            "fecha": "2025-09-04",
            "presente": false
          }]
      }],
    "dni": "1"
  },
  {
    "nombre": "Alumno 2",
    "curso": "1A",
    "materias": [{
      "nombre": "Matemática",
      "profesor": { "nombre": "Profe 1" },
      "notas": [{
        "tipo": "Parcial 1",
        "nota": { "$numberInt": "9" }
      }, {
        "tipo": "Parcial 2",
        "nota": { "$numberInt": "8" }
      }, {
        "tipo": "Parcial 3",
        "nota": { "$numberInt": "7" }
      }, {
        "tipo": "Parcial 4",
        "nota": { "$numberInt": "6" }
      }],
      "asistencias": [{
        "fecha": "2025-09-01",
        "presente": true
      }, {
        "fecha": "2025-09-02",
        "presente": false
      }
        , {
        "fecha": "2025-09-03",
        "presente": true
      }
        , {
        "fecha": "2025-09-04",
        "presente": true
      }]
    }, {
      "nombre": "Lengua",
      "profesor": { "nombre": "Profe 3" },
      "notas":
        [{
          "tipo": "Parcial 1",
          "nota": { "$numberInt": "6" }
        }
          , {
          "tipo": "Parcial 2",
          "nota": { "$numberInt": "7" }
        }
          , {
          "tipo": "Parcial 3",
          "nota": { "$numberInt": "8" }
        }, {
          "tipo": "Parcial 4",
          "nota": { "$numberInt": "9" }
        }],
      "asistencias": [{
        "fecha": "2025-09-01",
        "presente": true
      }, {
        "fecha": "2025-09-02",
        "presente": true
      }, {
        "fecha": "2025-09-03"
        , "presente": true
      }, {
        "fecha": "2025-09-04",
        "presente": true
      }]
    }],
    "dni": "2"
  },
  {
    "nombre": "Alumno 3",
    "curso": "1B",
    "materias": [{
      "nombre": "Historia",
      "profesor": { "nombre": "Profe 2" },
      "notas": [{
        "tipo": "Parcial 1",
        "nota": { "$numberInt": "8" }
      }, {
        "tipo": "Parcial 2",
        "nota": { "$numberInt": "7" }
      }, {
        "tipo": "Parcial 3",
        "nota": { "$numberInt": "6" }
      }, {
        "tipo": "Parcial 4",
        "nota": { "$numberInt": "9" }
      }], "asistencias": [{
        "fecha": "2025-09-01",
        "presente": true
      }, {
        "fecha": "2025-09-02",
        "presente": false
      }, {
        "fecha": "2025-09-03",
        "presente": true
      }, {
        "fecha": "2025-09-04",
        "presente": true
      }]
    },
    {
      "nombre": "Geografía",
      "profesor": { "nombre": "Profe 2" },
      "notas": [{
        "tipo": "Parcial 1",
        "nota": { "$numberInt": "9" }
      }, {
        "tipo": "Parcial 2",
        "nota": { "$numberInt": "8" }
      }, {
        "tipo": "Parcial 3",
        "nota": { "$numberInt": "7" }
      }, {
        "tipo": "Parcial 4",
        "nota": { "$numberInt": "6" }
      }],
      "asistencias": [{
        "fecha": "2025-09-01",
        "presente": true
      }, {
        "fecha": "2025-09-02",
        "presente": true
      }, {
        "fecha": "2025-09-03",
        "presente": true
      }, {
        "fecha": "2025-09-04",
        "presente": true
      }]
    }], "dni": "3"
  }
]