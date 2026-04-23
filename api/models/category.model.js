import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class Category extends Model {}

Category.init({

  name: {
    type: DataTypes.STRING(20),// maximum 20 caractères
    allowNull: false,
  }

}, {
  sequelize,
  tableName: "category" // défini le nom de la table
})