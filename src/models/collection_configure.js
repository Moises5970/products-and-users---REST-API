export async function configurarColecciones(db) { // Configura las reglas de validación para cada colección
    try { // Configuración para la colección "usuarios"
        await db.command({ // modifica la coleccion usuarios para agregar las validaciones
            collMod: "usuarios", // la coleccion usuarios se modifica 
            validator: { // se agrega un validador para la coleccion usuarios
                $jsonSchema: { // se define el esquema de validacion utilizando json schema 
                    bsonType: "object", // el tipo debe ser un objeto 
                    required: ["nombre", "email", "rol"], // los campos nombre, email y rol son obligatorios
                    properties: { // se definen las propiedades de la validación
                        nombre: {  // el campo nombre debe ser de tipo string 
                            bsonType: "string"  // el campo nombre debe ser de tipo string
                        },
                        email: { // el campo email
                            bsonType: "string", // el campo email debe ser de tipo string
                            pattern: "^.+@.+\\..+$"  // el campo email debe seguir el formato de correo electrónico
                        },
                        rol: { // campo rol
                            enum: ["admin", "cliente"] // el campo rol solo puede tener los valores "admin" o "cliente"
                        },
                        fechaRegistro: { // campo fecha
                            bsonType: "date" // debe ser tipo fecha 
                        }
                    }
                }
            }
        });
        console.log("Las reglas de validación han sido aplicadas a la colección usuarios");
    } catch (error) {
        console.error("Error al configurar usuarios:", error.message);
    }

    try { // Configuración para la colección "productos"
        await db.command({ // modifica la coleccion productos para agregar las validaciones
            collMod: "productos", // la coleccion productos se modifica
            validator: { // se agrega el validador para la coleccion productos
                $jsonSchema: { // se define el esquema de validacion utilizando json schema
                    bsonType: "object", // el tipo debe ser un objeto
                    required: ["nombre", "precio", "categoria"], // los campos nombre, precio y categoria son obligatorios
                    properties: { // se definen las propiedades de la validación
                        nombre: { // campo nombre
                            bsonType: "string"  // el campo nombre debe ser de tipo string
                        },
                        precio: {  // campo precio
                            bsonType: "double", // el campo precio debe ser de tipo double
                            minimum: 0 // el campo precio no puede ser negativo
                        },
                        stock: { // campo stock
                            bsonType: "int", // el campo stock debe ser de tipo entero
                            minimum: 0 // el campo stock no puede ser negativo
                        },
                        categoria: { // campo categoria
                            bsonType: "string" // el campo categoria debe ser de tipo string
                        },
                        creadoPor: { // campo creadoPor
                            bsonType: "string" // el campo creadoPor debe ser de tipo string
                        },
                        fechaCreacion: { // campo fechaCreacion
                            bsonType: "date" // el campo fechaCreacion debe ser de tipo fecha
                        }
                    }
                }
            }
        });
        console.log("Las reglas de validación han sido aplicadas a la colección productos");
    } catch (error) {
        console.error("Error al configurar productos:", error.message);
    }

    try { // Configuración para la colección "ventas"
        await db.command({ // modifica la coleccion ventas para agregar las validaciones
            collMod: "ventas", // se modifica la coleccion ventas
            validator: { // se agrega el validador para la coleccion ventas
                $jsonSchema: { // se define el esquema de validacion utilizando json schema
                    bsonType: "object", // el tipo debe ser un objeto
                    required: ["productoId", "cantidad", "total"], // campos obligatorios
                    properties: { // se definen las propiedades de la validación
                        productoId: { // campo productoId
                            bsonType: "objectId" // el campo productoId debe ser de tipo objectId
                        },
                        cantidad: { // campo cantidad 
                            bsonType: "int", // el campo cantidad debe ser de tipo entero
                            minimum: 1 // el campo cantidad debe ser al menos 1, no puede ser 0 o negativo
                        },
                        total: { // campo total
                            bsonType: "number", // el campo toal debe de ser tipo numero  
                            minimum: 0 // el campo total no puede ser negativo
                        },
                        fecha: { // campo fecha
                            bsonType: "date" // el campo fecha debe ser de tipo fecha
                        }
                    }
                }
            }
        });
        console.log("Las reglas de validación han sido aplicadas a la colección ventas");
    } catch (error) {
        console.error("Error al configurar ventas:", error.message);
    }
}