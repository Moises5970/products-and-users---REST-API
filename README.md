# Instrucciones para clonar el repositorio
1. Obtener la URL del repositorio en GitHub (https://github.com/Moises5970/products-and-users---REST-API.git).
2. En la terminal ejecutamos*git clone* seguido de la URL.
3. Entramos a la carpeta por medio de cd
4. verificamos el estado con *git status* el resultado debe de ser similar a este:
    On branch main
    Your branch is up to date with 'origin/main'
6. Apartir de ahi se realiza los commit de la misma manera, cabe aclarar que solo los dejara si tienes acceso.

# Configuración del entrono
1. En la terminal ejecutamos los siguientes comandos:
    - npm init -y
    - npm i express mongodb dotenv  
    - npm i -D nodemon
2. Se agregan scripts de automatización en el archivo package.json.
En la sección "scripts" se añaden los comandos:
    "dev": "nodemon src/server.js", 
    "start": "node src/server.js"
Sustituimos el *"type": "commonjs"* por *"type": "module"*