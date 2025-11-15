import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Componente de Ruta Privada
 * Si el usuario está logueado, permite el acceso a la ruta (Outlet).
 * Si no está logueado, redirige a /login.
 */
const PrivateRoute = () => {
    // Obtenemos el estado del usuario del contexto
    const { user } = useAuth(); 

    // Si 'user' tiene un valor (está logueado), permite el acceso (Outlet)
    // Si 'user' es null o undefined, redirige al componente <LoginPage />
    // La opción `replace` asegura que la página de login reemplace la URL actual en el historial.
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;