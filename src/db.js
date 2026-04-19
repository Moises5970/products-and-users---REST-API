import { MongoClient, ObjectId } from "mongodb";

let client;
let db;

export async function connectDB() {
    if (db) return db;  // singleton

    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();

    db = client.db(process.env.DB_NAME);

    console.log("MongoDB conectado a:", process.env.DB_NAME);
    return db;
}

export function getDB() {
    if (!db) throw new Error("DB no inicializada. Llama connectDB() primero.");
    return db;
}

export function toObjectId(value, fieldName = "id") {
    try {
        return new ObjectId(value);
    } catch {
        const err = new Error(`ObjectId inválido para '${fieldName}': ${value}`);
        err.status = 400;
        throw err;
    }
}