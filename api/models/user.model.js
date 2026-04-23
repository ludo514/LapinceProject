import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class User extends Model {}

User.init({

  first_name: {
    type: DataTypes.STRING(20), // maximum 20 caractères
    allowNull: false
  },

  last_name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // email doit être unique
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  sequelize,
  tableName: "user" // défini le nom de la table
})