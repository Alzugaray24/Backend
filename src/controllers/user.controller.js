import { userService } from "../services/service.js";
import { generateJWToken } from "../dirname.js";
import { createHash, isValidPassword } from "../dirname.js"

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const userData = req.body;

    const hashedPassword = createHash(userData.password);
    userData.password = hashedPassword;

    const newUser = await userService.save(userData);
    res.status(201).json({
      status: "Usuario creado con éxito",
      usuario: newUser,
    });
  } catch (error) {
    console.error("Error al registrar al usuario:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    await userService.update(id, newData);
    res.json("Usuario actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.delete(id);
    res.json("Usuario eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Se requieren correo electrónico y contraseña." });
    }

    const user = await userService.loginUser(email, password);

    console.log(user);

    if (user === null || !isValidPassword(user, password)) {
      return res
        .status(401)
        .json({ error: "Correo electrónico o contraseña incorrectos." });
    }

    const token = generateJWToken(user);
    return res.status(200).json({
      status: "Sesión iniciada",
      token: token,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwtCookieToken");
    res.json({
      status: "Sesión cerrada con éxito",
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const profileController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const githubCallbackController = async (req, res) => {
  try {
    const user = req.user;
    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };
    const access_token = generateJWToken(tokenUser);
    console.log(access_token);
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 60000,
      httpOnly: true,
    });
  } catch (error) {
    console.error("Error en la autenticación de GitHub:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
