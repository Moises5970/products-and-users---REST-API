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

  ###  Validación y Manejo de Errores
Integridad de los datos y la estandarización de respuestas de error.

* **Validación Nativa en MongoDB:** Implementación de esquemas de validación mediante `collMod` y `$jsonSchema` para garantizar que solo ingresen datos válidos (precios positivos, stock no negativo, campos obligatorios) directamente a nivel de base de datos.
* **Middleware de Errores Global:** Creación de un `errorHandler` centralizado que intercepta excepciones de MongoDB y del servidor, transformándolas en respuestas JSON amigables.
* **Gestión de Respuestas HTTP:**
    * **400 (Bad Request):** Para fallos de validación de esquemas.
    * **404 (Not Found):** Captura de rutas inexistentes para evitar respuestas HTML por defecto de Express.
    * **500 (Internal Server Error):** Manejo seguro de errores inesperados.
* **Conexión Segura:** Integración de las reglas de validación en el ciclo de vida del arranque del servidor en `db.js`.

# Rutas
### Usuarios

```
http://localhost:3000/usuarios
```

#### POST

Crear/registrar usuarios.

![crear usuario](imag/image1.png)

#### GET

Obtener los usuarios registrados.

![Obtener usuarios registrados](imag/image2.png)

#### GET /:id

Obtener un usuario en especifico.

![Obtener a un usuario](imag/image3.png)

#### PUT /:id

Actualizar un usuario.
![Actualizar un usuario](imag/image4.png)

#### DELETE /:id

Eliminar un usuario.
![Eliminar un usuario](imag/image5.png)


### Productos

```
http://localhost:3000/productos
```

#### POST

Crear/registrar productos.
![Resgistrar un producto](/imag/image6.png)

Se requiere el ID para identificar quien esta registrando el producto.

#### GET

Obtener los productos registrados.
![Obtener todos los productos registrados](imag/image7.png)

#### GET /:id

Obtener un producto en especifico.
![Obtener un producto especifico](imag/image8.png)

#### PUT /:id

Actualizar un producto.
![Actualizar un producto es especifico](imag/image9.png)

#### DELETE /:id

Eliminar un producto.
![Eliminar un producto en especifico](imag/image10.png)

### Ventas

```
http://localhost:3000/ventas
```

#### POST
![Registrar una venta](imag/image11.png)
En este caso se ingresa el ID por medio de body, que es otra forma de solicitarlo, ademas nos retorna el tortal a pagar de la venta.

#### GET
![Obtener todas las ventas](imag/image12.png)

#### DELETE /:id
![Eliminar una venta](imag/image13.png)

#### Consultas avanzadas con agregaciones

Suma del total de ventas y de la cantidad de productos vendidos.
![Resultado de la primiero consulta avnazada](imag/image14.png)

Cantidad de productos por categoria.
![Resultado de la segunda consulta avanzada](imag/image15.png)