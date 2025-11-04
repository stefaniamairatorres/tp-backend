# API RESTful de E-Commerce (Backend)

Este repositorio aloja la API RESTful construida con el stack MERN, diseñada para servir los datos y la lógica de negocio a la aplicación Frontend de la tienda de coctelería.

## Funcionalidades Implementadas

-   **Base de Datos:** Conexión y persistencia de datos con MongoDB y Mongoose.
-   **Gestión Completa de Datos (CRUD):** Endpoints para Productos y Categorías.
-   **Autenticación y Autorización:** Implementado con **JWT (JSON Web Tokens)** y **Bcrypt** para el hashing de contraseñas.
-   **Middleware de Protección:** Rutas protegidas para administradores y usuarios autenticados.
-   **Servicios:** Implementación de la lógica de negocio en una capa de servicios separada.

## Tecnologías Utilizadas

-   **Node.js & Express:** Servidor y Framework principal.
-   **MongoDB & Mongoose:** Base de datos y ODM (Object Data Modeling).
-   **JWT (JSON Web Tokens):** Para seguridad en la autenticación.
-   **Bcrypt:** Para cifrado de contraseñas.
-   **Dotenv:** Para manejo de variables de entorno.
-   **Cors:** Configuración para permitir solicitudes desde el Frontend (Vite).

## ⚙️ Configuración y Ejecución

### Requisitos

-   Node.js (versión LTS recomendada)
-   Una instancia de MongoDB (local o remota).

### Pasos

1.  Asegúrar de estar en la carpeta raíz del proyecto Backend (`/BACKEND-EXPRESS-GRUPO-B`).
2.  Instala las dependencias:
    ```bash
    npm install
    ```

### Variables de Entorno

PORT=5000

# URL de conexión a MongoDB

MONGO_URI=mongodb://localhost:27017/cudi_db

# Secret para JWT

JWT_SECRET=miSecretoSuperSeguro


### Ejecución en Modo Desarrollo

1.  Asegúrar de que MongoDB esté activa.
2.  Iniciar el servidor:
    ```bash
    npm start
    ```
La API estará operativa en `http://localhost:5000`.

## Endpoints Principales (Ejemplos)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Obtiene la lista completa de productos. |
| `GET` | `/api/categories` | Obtiene la lista de categorías. |
| `POST` | `/api/auth/register` | Registro de un nuevo usuario. |
| `POST` | `/api/auth/login` | Inicio de sesión (devuelve JWT). |
| `POST` | `/api/admin/products` | Crea un nuevo producto (Ruta protegida por Admin). |
| `POST` | `/api/purchases` | **Endpoint de Compra (Lógica del carrito pendiente de finalizar).** |
