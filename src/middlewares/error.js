export const errorHandler = (err, req, res, next) => { // Log del error para desarrollo
    console.error(" -- ERROR DETECTADO -- "); // Mensaje de error 
    console.error(err) // Si el error ya tiene un status lo usamos si no es un error de servidor


// validacion de mongodb
if(err.code === 121 || err.name === 'MongoServerError' && err.message.includes("validacion fallo")){ // si el error es de validacion de mongodb (code 121)
    return res.status(400).json({ // respondemos con un error 400 (bad request)
        ok: false, // se indica que la respuesta no es exitosa
        error: " Los datos proporcionados no cumplen con las reglas de validación de la base de datos", // mensaje de error 
        detalles: err.errInfo?.details || "Conflicto entre tipos de datos" // detalles del error
    })
}

// Error de duplicidad 
if(err.code === 11000){ // si el error es de duplicidad (code 11000)
    return res.status(400).json({ // respondemos con un error 400 
        ok: false, // se indica que la respuesta no es exitosa
        error: " Ya existe un registro con los datos ingresados" // mensaje de error
    })
}

// error de id de mongodb invalido (objectid mal formado)
if(err.kind === "ObjectId" || err.message.includes("ObjectId")){ // si el error es de id de mongodb invalido identificamos el error por el .kind o por el mensaje del error
    return res.status(400).json({ // respondemos con un error 400
        ok: false, // se indica que la respuesta no es exitosa
        error: " El ID proporcionado no es válido" // mensaje de error
    })
}


// error general
const statusCode = err.status || 500 // si el error ya tiene un status lo usamos, si no es un error de servidor 
res.status(statusCode).json({ // respondemos con el status del error o con un error 500 (internal server error)
    ok: false, // se indica que la respuesta no es exitosa
    error: err.message || "Ocurrio un error en el servidor" // mensaje de error, si el error no tiene un mensaje se muestra un mensaje 
}) 

}