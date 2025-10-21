# Aplicación Web para el control de carga de notas y asistencias en escuelas - ACADEMA - INSPT UTN

Proyecto desarrollado con el stack MERN (MongoDB, Express, React, Node.js)

## Modelo de datos

El sistema utiliza una base de datos que soporta modelos orientados a documentos alojada en MongoDB Atlas, esta estructurada en cuatro colecciones: Alumnos, Materias, Profesores y Usuarios.
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
Descripción: Representa las materias que se dictan en la institución, vinculadas a un curso, a un profesor responsable y a los alumnos inscriptos.

| **Campo** | **Tipo**      | **Validaciones** | **Descripción**                           |
| --------- | ------------- | ---------------- | ----------------------------------------- |
| _id       | ObjectId      | Autogenerado     | Identificador único de la materia         |
| nombre    | String        | required: true   | Nombre de la materia                      |
| curso     | String        | required: true   | Curso al que pertenece la materia         |
| profesor  | Object        | required: true   | Profesor asignado a la materia            |
| alumnos   | Array<Object> |                  | Lista de alumnos inscriptos en la materia |

Estructura del campo profesor:

| **Subcampo** | **Tipo** | **Validaciones** | **Descripción**                              |
| ------------ | -------- | ---------------- | -------------------------------------------- |
| nombre       | String   | required: true   | Nombre del profesor                          |
| id           | ObjectId | required: true   | ID del profesor en la colección `Profesores` |

Estructura del campo alumnos:

| **Subcampo** | **Tipo** | **Validaciones** | **Descripción**                            |
| ------------ | -------- | ---------------- | ------------------------------------------ |
| nombre       | String   | required: true   | Nombre del alumno inscripto                |
| dni          | String   | required: true   | Documento Nacional de Identidad del alumno |


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
Descripción: Representa a los usuarios del sistema, quienes pueden tener distintos roles: administrador, profesor o padre.
Los padres pueden tener hijos asociados mediante sus DNI.

| **Campo** | **Tipo**      | **Validaciones**                                             | **Descripción**                                                          |
| --------- | ------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| _id       | ObjectId      | Autogenerado                                                 | Identificador único del usuario                                          |
| nombre    | String        | required: true                                               | Nombre completo del usuario                                              |
| email     | String        | required: true, unique: true                                 | Correo electrónico del usuario (único)                                   |
| password  | String        | required: true                                               | Contraseña cifrada del usuario                                           |
| rol       | String        | required: true, enum: ['padre', 'profesor', 'administrador'] | Rol asignado al usuario dentro del sistema                               |
| hijos     | Array<String> | Opcional                                                     | Lista de DNI de los hijos asociados (solo para usuarios con rol "padre") |


## ⚙️ Configuración del entorno
### 1. Software necesario
Para correr el proyecto se necesita tener instalado:

* Node.js (recomendado v18 o superior)
* npm (gestor de paquetes)
* MongoDB Atlas (base de datos en la nube)
* Git (opcional, para clonar el repositorio)

### 2. Instalación del proyecto
- Clonar el repositorio:
git clone https://github.com/ManuelaRamdan/parcial2-api-mern.git

- Acceder a la carpeta del proyecto:
cd parcial2-api-mern

- Instalar las dependencias:
npm install

### 3. Variables de entorno

DB_URL=mongodb+srv://manuelaRamdan_user:9iPpm7WkPjrHcEhJ@cluster0.loupu0f.mongodb.net/academa?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
JWT_SECRET=root

### 4. Modos de ejecución

- Modo desarrollo (reinicio automático al guardar cambios):
npm run devstart

- Modo producción:
npm start

## Estructura del proyecto

📦 parcial2-api-mern
├── 📁 data
│   └── Archivos con datos de prueba o carga inicial para la base de datos.
│
├── 📁 src
│   ├── 📁 config
│   │   └── Configuración de la aplicación, como la conexión a MongoDB.
│   │
│   ├── 📁 controllers
│   │   └── Contienen la lógica principal de cada entidad (alumnos, profesores, usuarios, etc.).
│   │
│   ├── 📁 routes
│   │   └── Define las rutas de la API y las conecta con sus controladores.
│   │
│   ├── 📁 middleware
│   │   └── Funciones que se ejecutan entre la solicitud y la respuesta, como la verificación del token o los permisos.
│   │
│   ├── 📁 models
│   │   └── Esquemas de Mongoose que representan las colecciones de la base de datos.
│   │
│   ├── 📁 services
│   │   └── Código auxiliar para manejar procesos más complejos, como la sincronización entre colecciones.
│   │
│   └── 📁 utils
│       └── Funciones útiles o herramientas que se reutilizan en distintas partes del proyecto.
|
├── .env               # Variables de entorno (no se sube al repositorio)
├── package.json       # Dependencias y scripts del proyecto
├── README.md          # Documentación general del proyecto
└── src/index.js       # Inicio del servidor