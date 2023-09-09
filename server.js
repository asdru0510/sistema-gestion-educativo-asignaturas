const express = require('express'); // Importamos express
const userControllers = require('./controllers/user.controller'); //Importamos los controllers
const bootcampControllers = require('./controllers/bootcamp.controller');//Importamos los controllers
const PORT = 3000; //Definimos PORT

const app = express(); //Envolvemos express en la variable 'app'

app.use(express.json()); //habilitar el middleware que analiza el cuerpo de las solicitudes entrantes en formato JSON.

//Uso de rutas
app.use('/api',userControllers.router);
app.use('/api',bootcampControllers.router);

//Corremos el servidor
app.listen(PORT, 
  () => {console.log(`Escuchando en el puerto ${PORT}`);
});
