import { loginUser, registerUser } from "../services/user.service.js";
import { generateJWToken } from "../dirname.js"

export const registerController = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await registerUser(userData);
    res.status(201).json({
      status: "Usuario creado con éxito",
      usuario: newUser
    });
  } catch (error) {
    console.error("Error al registrar al usuario:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar si se proporcionaron el correo electrónico y la contraseña
    if (!email || !password) {
      return res.status(400).json({ error: "Se requieren correo electrónico y contraseña." });
    }

    // Intentar iniciar sesión con las credenciales proporcionadas
    const user = await loginUser(email, password);
    if (user === null) {
      // Si el usuario no se encontró o las credenciales son incorrectas, devolver un error de autenticación
      return res.status(401).json({ error: "Correo electrónico o contraseña incorrectos." });
    }

    // Si las credenciales son válidas, generar un token de autenticación (JWT) y devolverlo en la respuesta
    const token = generateJWToken(user); // Supongamos que tienes una función para generar tokens de autenticación
    return res.status(200).json({ 
      status: "Sesion iniciada",
      token: token
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const logoutController = async (req, res) => {
  try {
    // Limpiar la cookie de JWT
    res.clearCookie("jwtCookieToken");

    res.json({
      status: "Sesion cerrada con exito"
    })

    // Redirigir al usuario a la página de inicio de sesión
    res.redirect("/users/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const profileController = async (req, res) => {
  try {
      // Obtener el usuario del objeto de solicitud
      const user = req.user;

      // Verificar si el usuario existe
      if (!user) {
          // Si el usuario no está autenticado, enviar un código de estado 401 (No Autorizado)
          return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      // Enviar el perfil del usuario como respuesta
      return res.json({ user });
  } catch (error) {
      // Manejar cualquier error que ocurra durante el procesamiento del controlador
      console.error('Error al obtener el perfil del usuario:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const githubCallbackController = async (req,res) => {
  const user = req.user;

    // conJWT 
    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    };
    const access_token = generateJWToken(tokenUser);
    console.log(access_token);

    res.cookie('jwtCookieToken', access_token,
        {
            maxAge: 60000, // milisegundos de la cookie
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie

        }
    )
}



