import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class Budget extends Model {}

Budget.init({

  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },

  is_monthly: {
    type: DataTypes.BOOLEAN, // permet d'entrée une date au moment de la saisie du budget
    allowNull: true
  },

  date_budget: {
    type: DataTypes.DATEONLY, 
    allowNull: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  sequelize,
  tableName: "budget" // défini le nom de la table
})