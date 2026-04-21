import { bsonType } from "bson";

export async function configurarColecciones(db) { // Recibe la instancia de la base de datos
    try {
        // 1. Modelo de Usuarios con validaciones
        await db.createCollection("usuarios", { // Nombre de la coleccion
            validator: { // Validaciones para el modelo de usuarios 
                $jsonSchema: { // Esquema JSON para poder validar los documentos que se insertan 
                    bsonType: "object", // El documento debe ser un objeto 
                    required: ["nombre", "email", "rol"], // Campos obligatorios
                    properties: { // Propiedades y validaciones para cada campo 
                        nombre: { // El campo nombre debe ser texto
                            bsonType: "string", // El tipo de dato debe ser string 
                            description: "El nombre es requerido y debe ser texto" 
                        },
                        email: { // Campo email
                            bsonType: "string", // El tipo de dato del campo email debe ser string
                            pattern: "^.+@.+\\..+$", // Expresion para validar el formato email
                            description: "El email es requerido y debe tener un formato válido"
                        },
                        rol: {
                            enum: ["admin", "cliente"], // El campo rol solo puede tener los valores admin o cliente 
                            description: "El rol solo puede ser 'admin' o 'cliente'" 
                        },
                        fechaRegistro: {
                            bsonType: "date" // El campo fecha de registro debe ser tipo fecha
                        }
                    }
                }
            }
        });
        console.log(" La colección usuarios fue configurada con éxito."); // Si la colección se crea correctamente
    } catch (error) { // Si ocurre un error al crear la colección entra aqui
        // El código 48 significa que la colección ya existe.
        if (error.code === 48) {
            console.log("La colección usuarios ya existe en la base de datos.");
        } else {
            console.error("Error al configurar usuarios:", error);
        }
    }

    try {
        // 2. Modelo de Productos con sus validaciones y RELACIONES
        await db.createCollection("productos", { // Nombre de la coleccion de productos 
            validator: { // validaciones para el modelo de productos 
                $jsonSchema: { // Esquema JSON para validar los documentos de productos
                    bsonType: "object", // El documento debe ser un objeto
                    required: ["nombre", "precio", "categoria"], // Campos obligatorios para el modelo de productos 
                    properties: { // Propiedades y validaciones para cada campo del modelo de productos 
                        nombre: { // El campo nombre
                            bsonType: "string", // El tipo de dato del campo nombre debe ser string 
                            description: "El nombre del producto es requerido"
                        },
                        precio: { // campo precio
                            bsonType: "double", // El tipo de dato del campo precio debe ser double para permitir decimales
                            minimum: 0, // No permite precios negativos
                            description: "El precio es requerido y no puede ser negativo"
                        },
                        stock: { // Campo stock
                            bsonType: "int", // El tipo de dato del campo stock debe ser entero
                            minimum: 0, // No permite stock negativo
                            description: "El stock no puede ser negativo"
                        },
                        categoria: { // Campo categoria 
                            bsonType: "string", // El tipo de dato del campo categoria debe ser string 
                        },
                        // Referencia al usuario que agregó el producto
                        creadoPor: { // Campo creado Por para establecer la relación con el modelo de usuarios
                            bsonType: "objectId", // El tipo de dato del campo creadoPor debe ser objectId
                            description: "Relación: ID del usuario que registró el producto"
                        },
                        fechaCreacion: { // Campo fecha de creacion del producto
                            bsonType: "date" // El tipo de dato del campo fechaCreacion debe ser fecha
                        }
                    }
                }
            }
        });
        console.log("Colección 'productos' configurada con éxito."); // Si la colección se crea correctamente, se muestra este mensaje
    } catch (error) { // Si ocurre un error al crear la colección entra aqui
        if (error.code === 48) { // El código 48 significa que la colección ya existe.
            console.log("La colección 'productos' ya existe en la base de datos."); // Si la colección ya existe, se muestra este mensaje
        } else { 
            console.error("Error al configurar productos:", error); // Si ocurre otro tipo de error se mustra
        }
    }

    try { // Modelo de ventas con validaciones y relaciones 
        // 3. Modelos de ventas 
        await db.command({ // modifica la coleccion ventas para agregar validaciones 
            collMod: "ventas", // Nombre de la coleccion que se modifica 
            validator:{ // Validacion para el modelo de ventas 
                $jsonSchema: { // Esquema json para validar los documentos que vienen de ventas
                    bsonType: "object", // debe ser de tipo objeto
                    required: ["productoId", "cantidad", "total"], // son los campos obligatorios 
                    properties:{ // propiedades y validaciones
                        productoId: { // campo productoid para establecer la relacion con models de productos 
                            bsonType: "objectId", // El tipo de dato del campo productoId deber ser tipo objeto
                            description: "Id del producto vendido"
                        },
                        cantidad: { // campo cantidad para la cantidad de productos vendidos
                            bsonType: "int", // El tipo de dato del campo cantidad debe ser entero
                            minimum: 1, // La cantidad mínima debe ser 1
                            description: "La cantidad es solicitada y debe ser por lo menos 1"
                        },
                        total: { // campo total para el total de la venta
                            bsonType: "double", // El tipo de dato del campo total debe ser double para permitir decimales
                            minimum: 0, // El total mínimo debe ser 0, no puede ser negativo
                            description: "El total de la venta es solicitado y no puede ser negativo"
                        },
                        fecha: { // campo fecha para la fecha de la venta
                            bsonType: "date" // El tipo de dato del campo fecha debe ser fecha
                        }
                    }
                }
            }
        })
        console.log("Regla de validacion en ventas"); // Si la regla de validacion se agrega  se muestra el mensaje
        
    } catch (error){ // Si ocurre un error al agregar la regla de validacion en ventas entra aqui
        console.error("Error al configurar ventas " , error); // Si ocurre un error se muestra este mensaje
        
    }

}