import { verifyToken } from "./auth";

export default async function handler(req, res) {
  try {
    const user = verifyToken(req); // ← decodifica il token dal header
    res.status(200).json({ message: "Accesso autorizzato", user });
  } catch (err) {
    res.status(401).json({ message: "Accesso negato: token non valido" });
  }
}
import { verifyToken } from "./auth";

export default async function handler(req, res) {
  try {
    const user = verifyToken(req); // ← decodifica il token dal header
    res.status(200).json({ message: "Accesso autorizzato", user });
  } catch (err) {
    res.status(401).json({ message: "Accesso negato: token non valido" });
  }
}
