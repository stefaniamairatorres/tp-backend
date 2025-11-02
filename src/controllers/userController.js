// userController.js

// 🚨 Asegúrate de importar tu función para generar el token
import { registerUserService, loginUserService } from "../services/userService.js";
import generateToken from '../utils/generateToken.js'; // <--- (Asume esta ruta)

// Registro
export const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // 1. Crea el usuario a través del servicio
    const user = await registerUserService({ nombre, email, password });
    
    // 2. 🚨 GENERAR Y ESTABLECER EL TOKEN JWT
    // (Esto establece la cookie HttpOnly que el frontend necesita para autenticarse)
    generateToken(res, user._id); 
    
    // 3. Devolver los datos del usuario (sin la contraseña)
    res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        message: "Registro exitoso y sesión iniciada."
    });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login (no necesita cambios si funciona correctamente)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email y contraseña son requeridos" });

  try {
    // Asumimos que loginUserService ya maneja la generación de tokens
    const user = await loginUserService(email, password); 
    
    // 🚨 Si tu loginUserService NO genera el token, hazlo aquí también:
    // generateToken(res, user._id);
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};