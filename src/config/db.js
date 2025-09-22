
//importar mongoose -> librería de Node.js para conectarse y trabajar con bases de datos MongoDB de manera más sencilla y estructurada
const mongoose = require("mongoose");


//funcion para conectar a la base de datos
//La hacemos async porque vamos a usar await dentro -> mongoose.connect() es una operación asíncrona
// que es asincrona porque este proceso puede tardar un tiempo y no queremos bloquear el hilo principal de ejecución de la aplicación mientras esperamos la respuesta de la base de datos
//try catch para manejar errores en la conexión
//mongoose.connect() recibe como parámetro la URL de conexión a la base de datos, que está almacenada en una variable de entorno (process.env.DB_URL)
//variable de entorno -> es un valor que se guarda en el sistema operativo o en un archivo de configuración-> guardar información sensible como contraseñas o URLs de bases de datos fuera del código fuente.
//await hace que el programa espere hasta que la conexión se establezca antes de continuar.

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

//Exporta la función connectDB para que pueda usarse en otros archivos del proyecto
module.exports = connectDB;