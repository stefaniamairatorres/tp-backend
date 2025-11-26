import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "El email ya está registrado" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      password: hashedPass,
    });

    generateToken(res, user._id);

    return res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      message: "Registro exitoso",
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email no registrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Contraseña incorrecta" });

    generateToken(res, user._id);

    return res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      message: "Login exitoso",
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Sesión cerrada" });
};

export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};
