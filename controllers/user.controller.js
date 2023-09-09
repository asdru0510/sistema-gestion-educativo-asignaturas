const express = require("express");
const router = express.Router();
const { User } = require("../models/user.models");
const { Bootcamp } = require("../models/bootcamp.models");
require("../models/index");

//Crea un usuario
const createUser = async function (req, res) {
  const { firstName, lastName, email } = req.body;
  try {
    const userCreated = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
    });
    console.log(
      `Se ha creado el usuario: ${JSON.stringify(userCreated, null, 2)}`
    );
    res.json({ message: "Usuario creado", user: userCreated.toJSON() });
  } catch (error) {
    console.log("Error al crear el usuario.", error);
  }
};
//Encuentra un usuario por Id
const findUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Bootcamp,
        through: "user_bootcamp",
      },
    });
    if (user) {
      console.log(
        `Se ha encontrado el usuario: ${JSON.stringify(user, null, 2)}`
      );
      res.json({ message: "Usuario Encontrado", user: user });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log(
      "Error al obtener los bootcamps del usuario con id: " + userId,
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Traer todos los usuarios
const findAll = async function (req, res) {
  try {
    const findAllUsers = await User.findAll({
      include: {
        model: Bootcamp,
        through: "user_bootcamp",
      },
    });
    console.log(
      `Se han encontrado todos los usuario: ${JSON.stringify(
        findAllUsers,
        null,
        2
      )}`
    );
    res.json({ usuarios: findAllUsers });
  } catch (error) {
    console.log("Error al obtener todos los bootcamps de los usuarios.", error);
  }
};
//Actualizar un usuario, según su Id
const updateUserById = async (req, res) => {
  try {
    // 1. Recuperamos el Id del usuario
    const userId = parseInt(req.query.id);  //para pillar por la ruta de la forma /api/users?id=1
    console.log('valor req.query.id: ',req.query.id);
    console.log('id de usuario',userId, 'tipo: ',typeof(userId));
    // 2. Recuperamos el nombre y el balance
    const { firstName, lastName, email } = req.body;
    // 3. Actualizamos la base de datos
    const [affectedRows] = await User.update(
      {
        firstName,
        lastName,
        email,
      },
      { where: { id: userId } }
    );

    // Obtener el usuario actualizado
    if (affectedRows > 0) {
      const updatedUser = await User.findByPk(userId);
      console.log(
        `Usuario actualizado: ${JSON.stringify(updatedUser, null, 2)}`
      );
      res.json({ message: "Usuario actualizado:", user: updatedUser });
    } else {
      res.json({ message: "Ningún usuario actualizado." });
    }
  } catch (error) {
    console.log("Error al actualizar el usuario.", error);
  }
};

//Borrar el usuario, según Id
const deleteUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Obtener información del usuario antes de eliminarlo
    const userToDelete = await User.findByPk(id);

    // Eliminar el usuario
    const userDestroyed = await User.destroy({
      where: {
        id: id,
      },
    });

    if (userDestroyed > 0) {
      console.log(
        `Usuario eliminado: ${JSON.stringify(userToDelete, null, 2)}`
      );
      res.json({ message: "Usuario eliminado:", user: userToDelete });
    } else {
      res.json({ message: "Ningún usuario eliminado." });
    }
  } catch (error) {
    console.log("Error al eliminar el usuario.", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Rutas Users
router.post("/users", createUser);
router.get("/users/:id", findUserById);
router.get("/users", findAll);
router.put("/users", updateUserById);
router.delete("/users/:id", deleteUserById);

// Exportamos 
module.exports = {
  router, // Exporta el enrutador
  createUser,
  findUserById,
  findAll,
  updateUserById,
  deleteUserById,
}


