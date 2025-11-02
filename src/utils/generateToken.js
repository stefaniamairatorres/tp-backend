// src/utils/generateToken.js

import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    // 1. Generar el token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Expira en 30 días
    });

    // 2. Establecer el token como una cookie HttpOnly
    res.cookie('jwt', token, {
        httpOnly: true, // No accesible por JavaScript (seguridad)
        secure: process.env.NODE_ENV !== 'development', // Usa HTTPS en producción
        sameSite: 'strict', // Evita CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });
};

export default generateToken;