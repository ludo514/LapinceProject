import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class UserGroup extends Model {}

UserGroup.init({

  role: {
    type: DataTypes.ENUM("admin", "utilisateur"),
    allowNull: true
  },
  
  status: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  sequelize,
  tableName: "userGroup" // défini le nom de la table
})