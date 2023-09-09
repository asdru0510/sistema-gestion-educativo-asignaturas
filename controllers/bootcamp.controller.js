const express = require("express");
const router = express.Router(); //Declaramos router para manejar las rutas
const { Bootcamp } = require("../models/bootcamp.models"); // Importamos el modelo Bootcamp
const { User } = require("../models/user.models"); //Importamos el modelo User
require("../models/index"); //corremos el index

//Crear un bootcamp
const createBootcamp = async function (req, res) {
  const { title, cue, description } = req.body;
  try {
    const bootcampCreated = await Bootcamp.create({
      title,
      cue,
      description,
    });
    console.log(
      `Se ha creado el bootcamp: ${JSON.stringify(bootcampCreated, null, 2)}`
    );
    res.json({
      message: "Bootcamp creado",
      bootcamp: bootcampCreated.toJSON(),
    });
  } catch (error) {
    console.log("Error al crear el bootcamp.", error);
    res.status(400).json({ message: 'Hay un error al ingresar el bootcamp, tener en cuenta "cue" solo acepta números enteros menores o iguales a 10.' });
  }
};
// Agregamos un usuario a un bootcamp
const addUser = async (req, res) => {
  try {
    const UserId = parseInt(req.params.userId); // ID del usuario
    const BootcampId = parseInt(req.params.bootcampId); // ID del bootcamp
    const user = await User.findByPk(UserId);
    //console.log("id capturado del url: ", UserId);
    const bootcamp = await Bootcamp.findByPk(BootcampId);

    if (user && bootcamp) {
      await user.setBootcamps([bootcamp]); // Agregar el bootcamp al usuario
      console.log("User: ", user);
      console.log("Bootcamp: ", bootcamp);
      res.json({ message: `Usuario ${user.firstName} ${user.lastName} agregado al ${bootcamp.title}` });
    } else {
      console.log("User: ", user);
      console.log("Bootcamp: ", bootcamp);
      res.status(404).json({ message: "Usuario o bootcamp no encontrado" });
    }
  } catch (error) {
    console.error("Error al agregar usuario al bootcamp", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
//Busca un bootcamp por Id
const findById = async function (req, res) {
  let id = parseInt(req.params.id);
  try {
    const bootcampById = await Bootcamp.findByPk(id, {
      include: {
        model: User,
        through: "user_bootcamp",
      },
    });

    if (!bootcampById) {
      console.log("Id no encontrado!");
      res.status(404).json({ error: "Bootcamp no encontrado" });
    } else {
      console.log(JSON.stringify(bootcampById, null, 2));

      // Formateamos los datos antes de enviarlos como respuesta JSON
      //Aqui seleccionamos que mostrar y que en esta constante que luego se envia al usuario como res
      /* const formattedBootcamp = {
        id: bootcampById.id,
        title: bootcampById.title,
        cue: bootcampById.cue,
        description: bootcampById.description,
        //createdAt: bootcampById.createdAt,
        //updatedAt: bootcampById.updatedAt
      }; */
      res.json({ bootcamp: bootcampById });
    }
  } catch (error) {
    console.log("Error al buscar el bootcamp con id: " + id, error);
    res
      .status(400)
      .json({ error: "Ha ocurrido un error al buscar el bootcamp" });
  }
};
//Encuentra todos los bootcamp, con los usuarios de estos.
const findAll = async function (req, res) {
  try {
    const findAllBootcamp = await Bootcamp.findAll({
      include: {
        model: User,
        through: "user_bootcamp",
      },
    });
    console.log(
      `Se han encontrado todos los bootcamps: ${JSON.stringify(
        findAllBootcamp,
        null,
        2
      )}`
    );
    res.json({ Bootcamps: findAllBootcamp });
  } catch (error) {
    console.log("Error al obtener todos los bootcamps.", error);
  }
};

//Rutas Bootcamp
router.post("/bootcamps", createBootcamp);
router.get("/users/add/:userId/bootcamps/:bootcampId", addUser);
router.get("/bootcamps/:id", findById);
router.get("/bootcamps", findAll);

//Exportamos
module.exports = {
  router,
  createBootcamp,
  findById,
  findAll,
  addUser
};
