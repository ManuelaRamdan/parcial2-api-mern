[
  {
    //68cdd7717a9194521b3d5722
    "nombre": "Alumno 1",
    "curso": "1A",
    "materias": [
      {
        "materiaId": { "$oid": "68cdd53a7a9194521b3d571c" },
        "nombre": "Matemática",
        "profesor": { "id": { "$oid": "68cdd3317a9194521b3d5715" }, "nombre": "Profe 1" },
        "notas": [
          {"tipo":"Parcial 1","nota":8}, {"tipo":"Parcial 2","nota":7},
          {"tipo":"Parcial 3","nota":9}, {"tipo":"Parcial 4","nota":6}
        ],
        "asistencias": [
          {"fecha":"2025-09-01","presente":true}, {"fecha":"2025-09-02","presente":true},
          {"fecha":"2025-09-03","presente":false}, {"fecha":"2025-09-04","presente":true}
        ]
      },
      {
        "materiaId": { "$oid": "68cdd53a7a9194521b3d571e" },
        "nombre": "Lengua",
        "profesor": { "id": { "$oid": "68cdd3317a9194521b3d5717" }, "nombre": "Profe 3" },
        "notas": [
          {"tipo":"Parcial 1","nota":7}, 
          {"tipo":"Parcial 2","nota":8},
          {"tipo":"Parcial 3","nota":6}, 
          {"tipo":"Parcial 4","nota":9}
        ],
        "asistencias": [
          {"fecha":"2025-09-01","presente":true}, 
          {"fecha":"2025-09-02","presente":true},
          {"fecha":"2025-09-03","presente":true}, 
          {"fecha":"2025-09-04","presente":false}
        ]
      }
    ]
  },
  {//68cdd7717a9194521b3d5723
    "nombre": "Alumno 2",
    "curso": "1A",
    "materias": [
      { "materiaId": { "$oid": "68cdd53a7a9194521b3d571c" }, 
        "nombre":"Matemática", 
        "profesor":{"id": { "$oid": "68cdd3317a9194521b3d5715" }, "nombre": "Profe 1"}, 
        "notas":[
          {"tipo":"Parcial 1","nota":9},
          {"tipo":"Parcial 2","nota":8},
          {"tipo":"Parcial 3","nota":7},
          {"tipo":"Parcial 4","nota":6}],
        "asistencias":[
          {"fecha":"2025-09-01","presente":true},
          {"fecha":"2025-09-02","presente":false},
          {"fecha":"2025-09-03","presente":true},
          {"fecha":"2025-09-04","presente":true}] },
      { 
        "materiaId": { "$oid": "68cdd53a7a9194521b3d571e" }, 
        "nombre":"Lengua", 
        "profesor":{"id": { "$oid": "68cdd3317a9194521b3d5717" }, "nombre": "Profe 3"}, 
        "notas":[
          {"tipo":"Parcial 1","nota":6},
          {"tipo":"Parcial 2","nota":7},
          {"tipo":"Parcial 3","nota":8},
          {"tipo":"Parcial 4","nota":9}],
          "asistencias":[
            {"fecha":"2025-09-01","presente":true},
            {"fecha":"2025-09-02","presente":true},
            {"fecha":"2025-09-03","presente":true},
            {"fecha":"2025-09-04","presente":true}] }
    ]
  },
  {//68cdd7717a9194521b3d5724
    "nombre": "Alumno 3",
    "curso": "1B",
    "materias": [
      { 
        "materiaId":{ "$oid": "68cdd53a7a9194521b3d571d" }, 
        "nombre":"Historia",
        "profesor":{"id": { "$oid": "68cdd3317a9194521b3d5716" }, "nombre": "Profe 2"},
        "notas":[
          {"tipo":"Parcial 1","nota":8},{
            "tipo":"Parcial 2","nota":7},
            {"tipo":"Parcial 3","nota":6},
            {"tipo":"Parcial 4","nota":9}],
        "asistencias":[
          {"fecha":"2025-09-01","presente":true},
          {"fecha":"2025-09-02","presente":false},
          {"fecha":"2025-09-03","presente":true},
          {"fecha":"2025-09-04","presente":true}] },
      { 
        "materiaId": { "$oid": "68cdd53a7a9194521b3d571f" }, 
        "nombre":"Geografía",
        "profesor":{ "id": { "$oid": "68cdd3317a9194521b3d5716" }, "nombre": "Profe 2"},
        "notas":[
          {"tipo":"Parcial 1","nota":9},
          {"tipo":"Parcial 2","nota":8},
          {"tipo":"Parcial 3","nota":7},
          {"tipo":"Parcial 4","nota":6}],
        "asistencias":[
          {"fecha":"2025-09-01","presente":true},
          {"fecha":"2025-09-02","presente":true},
          {"fecha":"2025-09-03","presente":true},
          {"fecha":"2025-09-04","presente":true}] }
    ]
  }
]
