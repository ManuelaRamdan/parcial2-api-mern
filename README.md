# Aplicación Web para el control de carga de notas y asistencias en escuelas - ACADEMA - INSPT UTN

Proyecto desarrollado con el stack MERN (MongoDB, Express, React, Node.js)

## Modelo de datos
El sistema utiliza una base de datos que soporta modelos orientados a documentos alojada en MongoDB Atlas, esta estructurada en cuatro colecciones: usuarios, alumnos, profesores y materias.
Cada documento posee un campo _id autogenerado por MongoDB.

### Alumnos
Descripción: Representa a los alumnos, su curso y el seguimiento de sus materias, notas y asistencias.
| **Campo ** | **Tipo**      | **Validaciones** | **Descripción**                            |
|------------|---------------|------------------|--------------------------------------------|
|     _id    |    ObjectId   |   Autogenerado   | Identificador único del alumno             |
|   nombre   |     String    |  required: true  |              Nombre del alumno             |
|    curso   |     String    |  required: true  |      Curso al que pertenece el Alumno      |
|     dni    |    String     |  required: true  | Documento Nacional de Identidad del Alumno |
|  materias  | Array<Objeto> |                  |       Materias cursadas por el Alumno      |

Estructura de cada elemento del array materias:
| **Subcampo**    | **Tipo**      | **Validaciones** | **Descripción**             |
|-----------------|---------------|------------------|-----------------------------|
|      nombre     |     String    |  required: true  |     Nombre de la materia    |
| profesor.nombre |     String    |  required: true  | Nombre del Profesor a cargo |
|      notas      | Array<Objeto> |                  |  Calificaciones del Alumno  |
|     materias    | Array<Objeto> |                  |    Regitro de asistencias   |

Subestructura de notas:
| **Subcampo** | **Tipo** | **Validaciones** | **Descripción**               |
|--------------|----------|------------------|-------------------------------|
|     tipo     |  String  |  required: true  |       Tipo de evaluación      |
|     nota     |  Número  |  required: true  | Calificación de la evaluación |

Subestructura de asistencias:
| **Subcampo** | **Tipo** | **Validaciones** |             **Descripción**            |
|--------------|----------|------------------|:--------------------------------------:|
|     fecha    |   Date   |  required: true  |         Fecha de la asistencia         |
|   presente   |  Boolean |  required: true  | true si asistió, false si tuvo ausente |

### Materias
