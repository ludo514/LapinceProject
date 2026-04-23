import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

// middleware pour vérifier l'authentification de l'utilisateur en vérifiant le token JWT dans les en-têtes de la requête
export function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) { // vérifier que le token existe et qu'il commence par "Bearer "
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Missing token" }); 
  }

  const token = authHeader.split(" ")[1]; // extraire le token en supprimant le préfixe "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); 
    req.user = decoded; // si le token est valide, stocker les informations décodées dans l'objet req.user pour une utilisation ultérieure dans les routes protégées
    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" }); 
  }
}
