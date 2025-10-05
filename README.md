## 📁 Tabla de Contenidos

- [📚 Documentación Técnica de la API de Usuarios y Autenticación (Taller NestJS)](#-documentación-técnica-de-la-api)
- [🚀 Colección de Pruebas en Postman](#-colección-de-pruebas-en-postman)

# 📚 Documentación Técnica de la API

Esta documentación describe la API que construimos usando NestJS, JWT para la seguridad y una "base de datos" en memoria. El objetivo fue qué se pudiera enviar y esperar una correcta respuesta e interacción en cada cada _endpoint_.

---

## 🔑 Módulo 1: Autenticación (Rutas Públicas)

Estas rutas no requieren ningún token de seguridad, su objetivo es crear una cuenta o iniciar sesión para OBTENER el token (JWT) que usaremos después.

### 1. Registrar Nuevo Usuario

| Detalle     | Configuración                                                                                       |
| :---------- | :-------------------------------------------------------------------------------------------------- |
| **Ruta**    | `POST /auth/register`                                                                               |
| **Método**  | `POST`                                                                                              |
| **Función** | Crea un usuario, cifra la contraseña, guarda en la "DB en memoria" e inicia sesión automáticamente. |

**Request (Lo que envías):**

| Campo      | Tipo   | Requerido | Descripción                                       |
| :--------- | :----- | :-------- | :------------------------------------------------ |
| `nombre`   | string | Sí        | Nombre completo del usuario.                      |
| `email`    | string | Sí        | Correo electrónico único. **(Se valida con DTO)** |
| `password` | string | Sí        | Contraseña (mínimo 6 caracteres). **(Se cifra)**  |

```json
// POST http://localhost:3000/auth/register
{
  "nombre": "Estudiante Prueba",
  "email": "prueba@taller.com",
  "password": "miPasswordSeguro"
}
```

**Response(Lo que recibes):**

Si es exitoso, recibes el token de acceso.

```json
//Status: 201 Created
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBydWViYUB0YWx"
}
```

---

### 2. Iniciar Sesión

| Detalle     | Configuración                                                                     |
| :---------- | :-------------------------------------------------------------------------------- |
| **Ruta**    | `POST /auth/login`                                                                |
| **Método**  | `POST`                                                                            |
| **Función** | Valida el email y la contrasela cifrada. Si son correctos, devuelve un token JWT. |

**Request (Lo que envías):**

```json
//POST  http://localhost:3000/auth/login
{
  "email": "prueba@taller.com",
  "password": "miPasswordSeguro"
}
```

**Response(Lo que recibes):**

```json
// Status: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBydWViYUB0YW...."
}
```

---

## 🔐Módulo 2: Usuarios (Rutas Protegidas)

**IMPORTANTE:** Todas estas rutas requieren que incluyas el token JWT en el encabezado (Header) de la solicitud, en el formato: Authorization: Bearer [TU_TOKEN]. Si no lo haces, recibirás un error 401 Unauthorized.

### 3. Listar Todos los Usuarios

| Detalle     | Configuración                                       |
| :---------- | :-------------------------------------------------- |
| **Ruta**    | `GET /users`                                        |
| **Método**  | `GET`                                               |
| **Función** | Devuelve un array con todos los usuarios guardados. |

**Request:** (Solo el token en el encabezado)

**Response(Lo que recibes):**

Usamos el **UserResponseDto** para garantizar que la contraseña NUNCA se envíe.

```json
// Status: 200 OK
[
  {
    "id": "7ab42c90-8f9b-43a7-afc2-e43c71254a6c",
    "nombre": "Estudiante Prueba",
    "email": "prueba@taller.com",
    "fecha_creacion": "2025-10-05T06:15:00.000Z"
  }
]
```

---

### 4. Obtener Usuario por ID

| Detalle     | Configuración                                  |
| :---------- | :--------------------------------------------- |
| **Ruta**    | `GET /users/:id`                               |
| **Método**  | `GET`                                          |
| **Función** | Devuelve información de un usuario especifico. |

**Request:** (Token en el encabezado + ID en la URL)

```json
// GET http://localhost:3000/users/7ab42c90-8f9b-43a7-afc2-e43c71254a6c
```

**Response(Lo que recibes):**

Usamos el **UserResponseDto** para garantizar que la contraseña NUNCA se envíe.

```json
// Status: 200 OK
{
  "id": "7ab42c90-8f9b-43a7-afc2-e43c71254a6c",
  "nombre": "Estudiante Prueba",
  "email": "prueba@taller.com",
  "fecha_creacion": "2025-10-05T06:15:00.000Z"
}
```

---

### 5. Actualizar Datos de Usuario

| Detalle     | Configuración                                                                                    |
| :---------- | :----------------------------------------------------------------------------------------------- |
| **Ruta**    | `PUT /users/:id`                                                                                 |
| **Método**  | `PUT`                                                                                            |
| **Función** | Actualiza uno o más campos del usuario. Usa **UpdateUserDto** (todos los campos son opcionales). |

**Request (Lo que envías):**

Solo se envía los campos que deseas cambiar.

```json
// PUT http://localhost:3000/users/7ab42c90-8f9b-43a7-afc2-e43c71254a6c
{
  "nombre": "Estudiante Actualizado",
  "password": "otraNuevaClave123"
}
```

**Response(Lo que recibes):**

Muestra el objeto actualizado (sin el password).

```json
// PUT http://localhost:3000/users/7ab42c90-8f9b-43a7-afc2-e43c71254a6c
{
  "nombre": "Estudiante Actualizado",
  "password": "otraNuevaClave123"
}
```

---

### 6. Eliminar Usuario

| Detalle     | Configuración                  |
| :---------- | :----------------------------- |
| **Ruta**    | `DELETE /users/:id`            |
| **Método**  | `DELETE`                       |
| **Función** | Elimina permanente el usuario. |

**Request:** (Token en el encabezado + ID en la URL)

```json
// DELETE http://localhost:3000/users/7ab42c90-8f9b-43a7-afc2-e43c71254a6c
```

**Response(Lo que recibes):**

Usamos el **UserResponseDto** para garantizar que la contraseña NUNCA se envíe.

```json
// Status: 204 No Content
// (No devuelve cuerpo, solo indica que la operación fue exitosa)
```

---
# 👨🏻‍🚀 Colección de Pruebas en Postman
