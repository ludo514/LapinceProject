import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export class Transaction extends Model {}

Transaction.init({

  type: {
    type: DataTypes.STRING(20), // maximum 20 caractères
    allowNull: false
  },

  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },

  is_monthly: {
    type: DataTypes.BOOLEAN, // boolean pour savoir si c'est récurent ou pas
    allowNull: true
  },

  date_transaction: {
    type: DataTypes.DATEONLY, // permet d'entrée une date au moment de la saisie de la transaction
    allowNull: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  sequelize,
  tableName: "transaction" // défini le nom de la table
})