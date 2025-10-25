# Aplicación Web para el control de carga de notas y asistencias en escuelas - ACADEMA - INSPT UTN

Proyecto desarrollado con el stack MERN (MongoDB, Express, React, Node.js)

## Modelo de datos

El sistema utiliza una base de datos que soporta modelos orientados a documentos alojada en MongoDB Atlas, esta estructurada en cuatro colecciones: Alumnos, Materias, Profesores y Usuarios.
Cada documento posee un campo _id autogenerado por MongoDB.

![alt text](data/image.png)

## ⚙️ Configuración del entorno
### 1. Software necesario
Para correr el proyecto se necesita tener instalado:

* Node.js (recomendado v18 o superior)
* npm (gestor de paquetes)
* MongoDB Atlas (base de datos en la nube)
* Git (opcional, para clonar el repositorio)

### 2. Instalación del proyecto
- Clonar el repositorio:
```text
git clone https://github.com/ManuelaRamdan/parcial2-api-mern.git
```
- Acceder a la carpeta del proyecto:
```text
cd parcial2-api-mern
```
- Instalar las dependencias:
```text
npm install
```
### 3. Variables de entorno
```text
DB_URL=mongodb+srv://manuelaRamdan_user:9iPpm7WkPjrHcEhJ@cluster0.loupu0f.mongodb.net/academa?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
JWT_SECRET=root
```
### 4. Modos de ejecución

- Modo desarrollo (reinicio automático al guardar cambios):
```text
npm run devstart
```
- Modo producción:
```text
npm start
```
## Estructura del proyecto
```text
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
├── .env               # Variables de entorno
├── package.json       # Dependencias y scripts del proyecto
├── README.md          # Documentación general del proyecto
|__src/index.js       # Inicio del servidor

```
## Documentación de los endpoints

```text
https://documenter.getpostman.com/view/48221875/2sB3WjzPE4
```
