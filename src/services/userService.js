import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

export const registerUserService = async (data) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new Error("Email ya registrado");

    const user = new User(data);
    await user.save();

    return {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id)
    };
  } catch (error) {
    logger(error.message);
    throw new Error(error.message);
  }
};

export const loginUserService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Usuario no encontrado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    return {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generateToken(user._id)
    };
  } catch (error) {
    logger(error.message);
    throw new Error(error.message);
  }
};

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
