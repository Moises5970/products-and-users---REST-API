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

# Modelos y Validaciones de BD

## Validaciones y Manejo de Errores 

Para esta API se utilizó el driver oficial de MongoDB. Las reglas de negocio y la estructura de datos se blindaron a dos niveles: a nivel de base de datos y a nivel de rutas.

### 1. Validación Nativa en MongoDB ($jsonSchema)
Dado que las colecciones fueron creadas y pobladas previamente, se utilizó el comando `collMod` para inyectar reglas estrictas de validación a los documentos existentes y futuros:

* **Usuarios:** * Campos obligatorios: `nombre`, `email`, `rol`.
  * Formato: Correo electrónico validado mediante expresiones regulares.
  * Restricción: El campo `rol` utiliza un `enum` que solo permite 'admin' o 'cliente'.

* **Productos:**
  * Campos obligatorios: `nombre`, `precio`, `categoria`.
  * Restricciones numéricas: `precio` y `stock` no aceptan valores negativos.
  * Relación: `creadoPor` guarda la referencia en formato String del usuario creador.

* **Ventas:**
  * Campos obligatorios: `productoId`, `cantidad`, `total`.
  * Restricciones: La `cantidad` mínima es 1 y el `total` no puede ser menor a 0.
  * Relación: `productoId` exige un formato `ObjectId` válido.
