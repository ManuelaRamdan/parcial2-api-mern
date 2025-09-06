// src/controllers/usuarioController.js
const Usuario = require("../models/usuarioModel");


// Obtener todos los usuarios
function getAllUsuarios() {
  return Usuario.getAll();
}

// Obtener un usuario por ID
function getUsuarioById(id) {
  const usuario = Usuario.getById(id);
  if (!usuario) return { error: "Usuario no encontrado" };
  return usuario;
}

// Crear un nuevo usuario
function createUsuario(data) {
  const { nombre, rol } = data;
  if (!nombre || !rol) {
    return { error: "Faltan campos obligatorios" };
  }
  const nuevoUsuario = Usuario.create({ nombre, rol });
  return nuevoUsuario;
}

// Actualizar un usuario
function updateUsuario(id, data) {
  const usuarioActualizado = Usuario.update(id, data);
  if (!usuarioActualizado) return { error: "Usuario no encontrado" };
  return usuarioActualizado;
}

// Eliminar un usuario
function deleteUsuario(id) {
  const eliminado = Usuario.remove(id);
  if (!eliminado) return { error: "Usuario no encontrado" };
  return { message: "Usuario eliminado" };
}

// Exportar todas las funciones
module.exports = {getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario};
