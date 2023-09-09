const Sequelize = require('sequelize')
const dotenv=require('dotenv')

dotenv.config('../.')
console.log('Estoy en el db.config');
// 1. Creamos una constante con los datos para conectar con la base de datos
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
  logging:false
})

// 2. Sincronozamos con la base de datos
async function syncDB () {
  try {
    await db.authenticate()
    //console.log('Connections has been established successfully');
  }
  catch(error) {
    console.error('Unable to connect to database', error)
  }
}
syncDB()

module.exports = db