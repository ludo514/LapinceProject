import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class Group extends Model {}

Group.init({

  name: {
    type: DataTypes.STRING(20), // maximum 20 caractères
    allowNull: false,
    onDelete: "CASCADE"
  }

}, {
  sequelize,
  tableName: "group" // défini le nom de la table
})