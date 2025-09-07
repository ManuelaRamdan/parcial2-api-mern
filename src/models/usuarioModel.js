// src/models/usuarioModel.js
let usuarios = require("../../data/usuarios");

// Obtener todas
function getAll() {
  return usuarios;
}

// Buscar por ID
function getById(id) {
  return usuarios.find((u) => u.id === id);
  // pregunta uno por uno hasta encontrar el id que le pasamos
}

// Crear
function create(usuario) {
  // ...usuarios -> expande el array en elementos individuales
  // Math.max(...[1,2,3,4,5]) -> 5
  // Si el array estuviera vacio, el id deberia ser 1
  // Si no, el id deberia ser el maximo + 1
  //materias: usuario.materias || [] para que si no viene, se inicialice como array vacio
  const newId = usuarios.length ? Math.max(...usuarios.map((r) => r.id)) + 1 : 1;
  //const nuevo = { id: newId, ...usuario, materias: usuario.materias || [] };
  const nuevo = { id: newId, ...usuario};
  usuarios.push(nuevo);
  return nuevo;
}

// Actualizar
function update(id, data) {
  let usuarioActualizado = null;
  //findIndex devuelve la posicion del elemento que cumple la condicion
  //si no lo encuentra devuelve -1
  const index = usuarios.findIndex((u) => u.id === id);
  if (index !== -1) {
    // {...usuarios[index], ...data} -> crea un nuevo objeto con los datos viejos y los nuevos
    // copia el usuario y además sobrescribe o agrega las propiedades que estén en data.
    
    // Para evitar que se cambie el id, lo reasignamos -> id: usuarios[index].id
    usuarios[index] = { ...usuarios[index], ...data, id: usuarios[index].id };
    usuarioActualizado = usuarios[index];
  }
  return usuarioActualizado;
}

// Eliminar: El alumno debe refactorear este codigo feo
//splice -> es un método de los arrays en JavaScript que sirve para agregar, reemplazar o eliminar elementos de un array.
function remove(id) {
  id = parseInt(id);
  const index = usuarios.findIndex((u) => u.id === id);
  let existeUsuario = false;
  if (index !== -1) {
    existeUsuario = true;
    usuarios.splice(index, 1);
    // index -> es la posición en el array donde se realizará la operación.
    // 1 -> es la cantidad de elementos que se eliminarán a partir de la posición indicada por index.
  }
  return existeUsuario;
}

module.exports = { getAll, getById, create, update, remove };