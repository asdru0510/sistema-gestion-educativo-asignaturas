const db=require('../config/db.config') 
const {User} = require('./user.models'); //Importamos el modelo User
const {Bootcamp}=require('./bootcamp.models'); //Importamos el modelo Bootcamp


//Hacemos la relacion N a N en la DB y crea la tabla 'user_bootcamp'
User.belongsToMany(db.models.Bootcamp,{through:'user_bootcamp'});
Bootcamp.belongsToMany(db.models.User,{through:'user_bootcamp'});

//Sincronizamos con la DB
try {
    db.sync();
    console.log('Conexión establecida exitosamente a la DB');
  } catch (error) {
    console.log('Imposible contectar a la base de datos.', error);
  };
//Exportamos los modelos
module.exports={
    User,
    Bootcamp
}