import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  console.log("[DEBUG] ➤ API CALL: /api/register");

  if (req.method !== "POST") {
    console.log("[DEBUG] ➤ Metodo non supportato:", req.method);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password, nickname, avatar } = req.body;
  console.log("[DEBUG] ➤ Dati ricevuti:", { email, password, nickname, avatar });

  if (!email || !password || !nickname) {
    console.log("[DEBUG] ➤ Campi mancanti");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { db } = await connectToDatabase();
    console.log("[DEBUG] ➤ Connessione DB riuscita");

    const existingUser = await db.collection("users").findOne({ email });
    console.log("[DEBUG] ➤ Controllo utente esistente:", existingUser);

    if (existingUser) {
      return res.status(409).json({ message: "Email già registrata" });
    }

    const result = await db.collection("users").insertOne({
      email,
      password,
      nickname,
      avatar,
      createdAt: new Date()
    });

    console.log("[DEBUG] ➤ Registrazione completata:", result.insertedId);

    return res.status(201).json({ message: "Registrazione completata", userId: result.insertedId });

  } catch (err) {
    console.error("[ERRORE] ➤", err.message);
    return res.status(500).json
