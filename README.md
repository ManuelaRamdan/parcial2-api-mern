# Aplicación Web para el control de carga de notas y asistencias en escuelas - ACADEMA - INSPT UTN

Proyecto desarrollado con el stack MERN (MongoDB, Express, React, Node.js)

## Modelo de datos

El sistema utiliza una base de datos que soporta modelos orientados a documentos alojada en MongoDB Atlas, esta estructurada en cuatro colecciones: usuarios, alumnos, profesores y materias.
Cada documento posee un campo _id autogenerado por MongoDB.

### Alumnos

Descripción: Representa a los alumnos, su curso y el seguimiento de sus materias, notas y asistencias.

| **Campo** | **Tipo**      | **Validaciones** | **Descripción**                            |
| --------- | ------------- | ---------------- | ------------------------------------------ |
| _id       | ObjectId      | Autogenerado     | Identificador único del alumno             |
| nombre    | String        | required: true   | Nombre del alumno                          |
| curso     | String        | required: true   | Curso al que pertenece el alumno           |
| dni       | String        | required: true   | Documento Nacional de Identidad del alumno |
| materias  | Array<Object> |                  | Materias cursadas por el alumno            |


Estructura de cada elemento del array materias:

| **Subcampo**    | **Tipo**      | **Validaciones** | **Descripción**             |
| --------------- | ------------- | ---------------- | --------------------------- |
| nombre          | String        | required: true   | Nombre de la materia        |
| profesor.nombre | String        | required: true   | Nombre del profesor a cargo |
| notas           | Array<Object> |                  | Calificaciones del alumno   |
| asistencias     | Array<Object> |                  | Registro de asistencias     |


Subestructura de notas:

| **Subcampo** | **Tipo** | **Validaciones** | **Descripción**       |
| ------------ | -------- | ---------------- | --------------------- |
| tipo         | String   | required: true   | Tipo de evaluación    |
| nota         | Number   | required: true   | Calificación obtenida |


Subestructura de asistencias:

| **Subcampo** | **Tipo** | **Validaciones** | **Descripción**                              |
| ------------ | -------- | ---------------- | -------------------------------------------- |
| fecha        | Date     | required: true   | Fecha de la asistencia                       |
| presente     | Boolean  | required: true   | `true` si asistió, `false` si estuvo ausente |


### Materias

### Profesores

Descripción: Representa a los docentes, con la información de las materias que dictan y los alumnos asociados.

| **Campo**        | **Tipo**      | **Validaciones** | **Descripción**                  |
| ---------------- | ------------- | ---------------- | -------------------------------- |
| _id              | ObjectId      | Autogenerado     | Identificador único del profesor |
| nombre           | String        | required: true   | Nombre completo del profesor     |
| materiasDictadas | Array<Object> |                  | Materias que el profesor dicta   |

Estructura del campo materiasDictadas:

| **Subcampo** | **Tipo**      | **Validaciones** | **Descripción**                 |
| ------------ | ------------- | ---------------- | ------------------------------- |
| nombre       | String        | required: true   | Nombre de la materia dictada    |
| curso        | String        | required: true   | Curso donde se dicta la materia |
| alumnos      | Array<Object> |                  | Alumnos asociados a la materia  |

Estructura del campo alumnos:

| **Subcampo** | **Tipo**      | **Validaciones** | **Descripción**           |
| ------------ | ------------- | ---------------- | ------------------------- |
| nombre       | String        | required: true   | Nombre del alumno         |
| dni          | String        | required: true   | DNI del alumno            |
| notas        | Array<Object> |                  | Calificaciones del alumno |
| asistencias  | Array<Object> |                  | Registro de asistencias   |

### Usuarios
Descripción: Representa a todos los usuarios que pueden acceder al sistema (administradores, profesores, padres).
| **Campo**  | **Tipo** | **Validaciones**                                             | **Descripción**                      |
| ---------- | -------- | ------------------------------------------------------------ | ------------------------------------ |
| _id        | ObjectId | Autogenerado                                                 | Identificador único del usuario      |
| nombre     | String   | required: true                                               | Nombre del usuario                   |
| email      | String   | required: true, unique: true                                 | Correo electrónico del usuario       |
| contraseña | String   | required: true                                               | Contraseña encriptada para el acceso |
| rol        | String   | required: true, enum: ['administrador', 'profesor', 'padre'] | Rol dentro del sistema               |


