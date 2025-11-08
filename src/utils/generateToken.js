

import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    // 1. Generar el token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Expira en 30 días
    });

    // 2. Establecer el token como una cookie HttpOnly
    res.cookie('jwt', token, {
        httpOnly: true, 
        // Asegurar que 'secure' siempre sea true en Render
        // Dado que Render está en HTTPS, es mejor forzarlo a true, o asegurarnos de que NODE_ENV esté correcto
        secure: true, // FORZAR a true para HTTPS en Render
        
        // Debe ser 'None' para permitir la comunicación Netlify <-> Render
        sameSite: 'None', 
        
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });
};

export default generateToken;