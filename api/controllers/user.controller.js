// import { StatusCodes } from "http-status-codes";
// import { User } from "../models/index.js";


// export async function getAll(req, res) { // récupère tous les utilisateurs de la base de données
//     const users = await User.findAll() 
//     return res.json(users);
// }

// // récupère l'utilisateur par son ID
// export async function getById(req, res) {
//   const user = await User.findByPk(req.params.id); 
//   if (!user) { 
//     return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
//   }
//   return res.json(user); 
// }

// // supprime l'utilisateur par son ID
// export async function deleteById(req, res) {
//   const deleted = await User.destroy({ where: { id: req.params.id } }); 
//   if (deleted === 0) { 
//     return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
//   }
//   res.status(StatusCodes.NO_CONTENT).end();
// }


// // met à jour l'utilisateur avec les données du corps de la requête
// export async function update(req, res) {
//   const [updatedCount, updatedUser] = await User.update(req.body, { 
//     where: { id: req.params.id },
//     returning: true,
//   });
//   if (updatedCount === 0) {
//     return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
//   }
//   return res.json(updatedUser[0]);
// }

