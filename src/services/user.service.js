import UserDAO from "../daos/user.dao.js";
import { createHash, isValidPassword } from "../dirname.js"; // Supongamos que tienes una función para hashear contraseñas

const userDao = new UserDAO();

export const registerUser = async (userData) => {
  try {
    const { first_name, last_name, email, age, password } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await userDao.findUserByEmail(email);
    if (existingUser) {
      throw new Error("El usuario ya está registrado");
    }

    // Crear el nuevo usuario
    const hashedPassword = createHash(password);
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    };
    return await userDao.createUser(newUser);
  } catch (error) {
    console.error("Error registrando al usuario:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Buscar el usuario por correo electrónico
    const user = await userDao.findUserByEmail(email);
    if (!user) {
      // Si el usuario no existe, retornar null
      return null;
    }

    console.log(user);
    // Verificar si la contraseña proporcionada coincide con la almacenada
    const isValid = isValidPassword(user, password);
    if (!isValid) {
      // Si la contraseña no es válida, retornar null
      return null;
    }

    console.log("aca");

    // Si las credenciales son válidas, devolver el usuario
    return user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

