# API RESTful de E-Commerce (Backend)

Este repositorio aloja la API RESTful construida con el stack MERN, diseñada para servir los datos y la lógica de negocio a la aplicación Frontend de la tienda de coctelería.


## Funcionalidades Implementadas

* **Base de Datos:** Conexión y persistencia de datos con MongoDB y Mongoose.
* **Gestión Completa de Datos (CRUD):** Endpoints para Productos y Categorías.
* **Autenticación y Autorización:** Implementado con **JWT (JSON Web Tokens)** y **Bcrypt** para el hashing de contraseñas.
* **Middleware de Protección:** Rutas protegidas para administradores y usuarios autenticados.
* **Servicios:** Implementación de la lógica de negocio en una capa de servicios separada.

## Tecnologías Utilizadas

* **Node.js & Express:** Servidor y Framework principal.
* **MongoDB & Mongoose:** Base de datos y ODM (Object Data Modeling).
* **JWT (JSON Web Tokens):** Para seguridad en la autenticación.
* **Bcrypt:** Para cifrado de contraseñas.
* **Dotenv:** Para manejo de variables de entorno.
* **Cors:** Configuración para permitir solicitudes desde el Frontend (Vite).

---

## ⚙️ Configuración y Ejecución

### Requisitos

* Node.js (versión LTS recomendada)
* Una instancia de MongoDB (local o remota).

### Pasos


1.  Asegúrate de estar en la carpeta raíz del proyecto Backend.

1.  Asegúrar de estar en la carpeta raíz del proyecto Backend (`/BACKEND-EXPRESS-GRUPO-B`).

2.  Instala las dependencias:
    ```bash
    npm install
    ```

### Variables de Entorno (Ejecución Local)

Para la ejecución local, debes crear un archivo `.env` con las siguientes variables:

```env
PORT=5000

# URL de conexión a MongoDB Atlas. Reemplazar <db_password> con su clave real.
MONGO_URI=mongodb+srv://stefaniamairatorres_db_user:<db_password>@cudi-db-cluster.hy3t0zl.mongodb.net/?appName=cudi-db-cluster

# Secret para JWT
JWT_SECRET=miSecretoSuperSeguro

# URL del Frontend (usada para CORS)
FRONTEND_URL=http://localhost:5173


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

---

# 🚀 Detalles Finales del Despliegue del Proyecto

Este proyecto consiste en una aplicación Full-Stack con un Frontend desplegado en Netlify y un Backend (API) desplegado en Render.

| Componente | Estado | Enlace |
| :--- | :--- | :--- |
| **Link Repositorio Backend** | ✅ Listo | `https://github.com/stefaniamairatorres/tp-backend.git` |
| **Link Repositorio Frontend** | ✅ Listo | `https://github.com/stefaniamairatorres/tp-grupo-b.git` |
| **Link Frontend Desplegado** | ✅ Listo | `https://remarkable-souffle-ccdbb3.netlify.app` |
| **Link Backend Desplegado (API)** | ✅ Listo | `https://tp-backend-2-mftw.onrender.com` |

---

## ⚙️ Variables de Entorno de Ejemplo (Archivos .env.example)

Se utiliza un archivo `.env.example` en cada repositorio para mostrar las variables de configuración necesarias para el **despliegue en la nube**.

### Backend (.env.example)

```env
# URL de conexión a MongoDB Atlas. REEMPLAZAR <db_password> con la clave real.
MONGO_URI=mongodb+srv://stefaniamairatorres_db_user:<db_password>@cudi-db-cluster.hy3t0zl.mongodb.net/?appName=cudi-db-cluster
JWT_SECRET=miSecretoSuperSeguro
PORT=5000
FRONTEND_URL=https://remarkable-souffle-ccdbb3.netlify.app


