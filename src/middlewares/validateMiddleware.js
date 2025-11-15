import { body, validationResult } from "express-validator";

// Validación para registro de usuario
export const validateRegister = [
  body("nombre").notEmpty().withMessage("Nombre obligatorio"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("Contraseña mínimo 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
