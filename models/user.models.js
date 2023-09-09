const { DataTypes: dt } = require('sequelize');
const db = require('../config/db.config');

//Definimos el modelo Bootcamp
const User = db.define('User', {
  firstName: {
    type: dt.STRING,
    allowNull: false
  },
  lastName: {
    type: dt.STRING,
    allowNull: false
  },
  email: {
    type: dt.STRING,
    allowNull: false,
    validate: {
      isEmail: true, // Validación para asegurar que el valor sea un correo electrónico válido
  }  
}
},
 {timestamps: true})
//Sincronizamos con la DB
try {
  User.sync()
}
catch(err) {
  console.error('Something went wrong with the SYNC of the table User', err)
}
//Exportamos User
module.exports={User}

