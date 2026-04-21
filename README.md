# Instrucciones para clonar el repositorio
1. Obtener la URL del repositorio en GitHub (https://github.com/Moises5970/products-and-users---REST-API.git).
2. En la terminal ejecutamos*git clone* seguido de la URL.
3. Entramos a la carpeta por medio de cd
4. verificamos el estado con *git status* el resultado debe de ser similar a este:
    On branch main
    Your branch is up to date with 'origin/main'
6. Apartir de ahi se realiza los commit de la misma manera, cabe aclarar que solo los dejara si tienes acceso.

# Configuración del entorno
1. En la terminal ejecutamos los siguientes comandos:
    - npm init -y
    - npm i express mongodb dotenv  
    - npm i -D nodemon
2. Se agregan scripts de automatización en el archivo package.json.
En la sección "scripts" se añaden los comandos:
    "dev": "nodemon src/server.js", 
    "start": "node src/server.js"
Sustituimos el *"type": "commonjs"* por *"type": "module"*
3. 

# Modelos y Validaciones de BD

Para esta API, se implementó la validación de esquemas nativos de MongoDB utilizando `$jsonSchema` utilizando el driver oficial.

* **Usuarios** *Campos Obligatorios: `nombre`, `email`, `rol`.
  * Validación estricta de formato de correo electronico mediante las expresiones regulares.
  * Restricción de valores para el campo del `rol` permiriendo solo dos tipo 'admin' o 'cliente'

* **Productos:**
  * Campos obligatorios: `nombre`, `precio`, `categoria`.
  * Restricciones: Se prohíbe el insertar de valores negativos en los campos `precio` y `stock`.
  * Relaciones: Implementación de referencia guardando el `ObjectId` del usuario en el campo `creadoPor`.

* **Ventas:**
  * Campos obligatorios: `productoId`, `cantidad`, `total`.
  * Restricciones: La `cantidad` mínima es 1 y el `total` no puede ser menor a 0.
  * Relación: `productoId` exige un formato `ObjectId` válido.

  ### Integrante 2: Validación y Manejo de Errores
Integridad de los datos y la estandarización de respuestas de error.

* **Validación Nativa en MongoDB:** Implementación de esquemas de validación mediante `collMod` y `$jsonSchema` para garantizar que solo ingresen datos válidos (precios positivos, stock no negativo, campos obligatorios) directamente a nivel de base de datos.
* **Middleware de Errores Global:** Creación de un `errorHandler` centralizado que intercepta excepciones de MongoDB y del servidor, transformándolas en respuestas JSON amigables.
* **Gestión de Respuestas HTTP:**
    * **400 (Bad Request):** Para fallos de validación de esquemas.
    * **404 (Not Found):** Captura de rutas inexistentes para evitar respuestas HTML por defecto de Express.
    * **500 (Internal Server Error):** Manejo seguro de errores inesperados.
* **Conexión Segura:** Integración de las reglas de validación en el ciclo de vida del arranque del servidor en `db.js`.
