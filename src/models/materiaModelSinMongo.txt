// src/models/usuarioModel.js
let materias = require("../../data/materias");

// Obtener todas
function getAll() {
  return materias;
}

// Buscar por ID
function getById(id) {
  return materias.find((m) => m.id === id);
  // pregunta uno por uno hasta encontrar el id que le pasamos
}

// Crear
function create(materia) {
  // ...materias -> expande el array en elementos individuales
  // Math.max(...[1,2,3,4,5]) -> 5
  // Si el array estuviera vacio, el id deberia ser 1
  // Si no, el id deberia ser el maximo + 1
  const newId = materias.length ? Math.max(...materias.map((m) => m.id)) + 1 : 1;
  const nuevo = { id: newId, ...materia };
  materias.push(nuevo);
  return nuevo;
}

// Actualizar
function update(id, data) {
  let materiaActualizado = null;
  //findIndex devuelve la posicion del elemento que cumple la condicion
  //si no lo encuentra devuelve -1
  const index = materias.findIndex((u) => u.id === id);
  if (index !== -1) {
    // {...materias[index], ...data} -> crea un nuevo objeto con los datos viejos y los nuevos
    // copia el materia y además sobrescribe o agrega las propiedades que estén en data.

    materias[index] = { ...materias[index], ...data, id: materias[index].id };
    materiaActualizado = materias[index];
  }
  return materiaActualizado;
}

// Eliminar: El alumno debe refactorear este codigo feo
//splice -> es un método de los arrays en JavaScript que sirve para agregar, reemplazar o eliminar elementos de un array.
function remove(id) {
  id = parseInt(id);
  const index = materias.findIndex((m) => m.id === id);
  let existeMateria = false;
  if (index !== -1) {
    existeMateria = true;
    materias.splice(index, 1);
    // index -> es la posición en el array donde se realizará la operación.
    // 1 -> es la cantidad de elementos que se eliminarán a partir de la posición indicada por index.
  }
  return existeMateria;
}

module.exports = { getAll, getById, create, update, remove };