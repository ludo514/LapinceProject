import "dotenv/config";
import sequelize from "../config/database.js";

// Importe tous les modèles pour que Sequelize les connaisse avant le sync

import "../models/index.js"

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à PostgreSQL réussie");

    //Supprime les tables connues par Sequelize.
    await sequelize.drop({}); // rajout de {} nécessaire quand il y à des champs ENUM 

    console.log("Drop des tables réussi");

    //Recrée les tables à partir des modèles importés.
    await sequelize.sync();
    console.log("Synchronisation Sequelize réussie");
  } catch (error) {
    console.error("Erreur pendant la migration :", error);
  } finally {
    // Ferme proprement la connexion à la base
    await sequelize.close();
    console.log("Connexion à PostgreSQL fermée");
  }
}

migrate();