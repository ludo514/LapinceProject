import "dotenv/config";
import argon2 from "argon2";
import sequelize from "../config/database.js";

import { User, Group, Transaction, Category, Budget, UserGroup } from "../models/index.js";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à PostgreSQL réussie");

    // On vide les tables
    await UserGroup.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Transaction.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Budget.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Category.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await User.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Group.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    console.log("Anciennes données supprimées");

    // SEED GROUPS
    const groups = await Group.bulkCreate(
      [
        { name: "Coloc Paris" },
        { name: "Famille Martin" },
      ],
      { returning: true }
    );

    console.log("Groups créés");

    // Hash du mot de passe de test
    const hashedPassword = await argon2.hash("motdepasse123");

    // SEED USERS
    const users = await User.bulkCreate(
      [
        {
          first_name: "Brice",
          last_name: "Dupont",
          email: "brice@test.com",
          password: hashedPassword,
        },
        {
          first_name: "Ludo",
          last_name: "Martin",
          email: "ludo@test.com",
          password: hashedPassword,
        },
        {
          first_name: "Guillaume",
          last_name: "Durand",
          email: "guillaume@test.com",
          password: hashedPassword,
        },
      ],
      { returning: true }
    );

    console.log("Users créés");

    // SEED CATEGORIES
    const categories = await Category.bulkCreate(
      [
        { name: "Courses" },
        { name: "Loyer" },
        { name: "Essence" },
        { name: "Achats/Loisirs" },
        { name: "Salaire" },
        { name: "Abonnements"}
      ],
      { returning: true }
    );

    console.log("Categories créées");

    // SEED USER_GROUP
    const userGroups = await UserGroup.bulkCreate(
      [
        {
          UserId: users[0].id,
          GroupId: groups[0].id,
          role: "admin",
          status: "accepted",
        },
        {
          UserId: users[1].id,
          GroupId: groups[0].id,
          role: "utilisateur",
          status: "accepted",
        },
        {
          UserId: users[2].id,
          GroupId: groups[1].id,
          role: "admin",
          status: "accepted",
        },
      ],
      { returning: true }
    );

    console.log("UserGroup créés");

    // SEED BUDGETS
    const budgets = await Budget.bulkCreate(
      [
        {
          amount: 2500.00,
          is_monthly: true,
          date_budget: "2026-03-01",
          name: "Budget mars coloc",
          group_id: groups[0].id,
        },
        {
          amount: 4000.00,
          is_monthly: true,
          date_budget: "2026-03-01",
          name: "Budget mars famille",
          group_id: groups[1].id,
        },
      ],
      { returning: true }
    );

    console.log("Budgets créés");

    // SEED TRANSACTIONS
    const transactions = await Transaction.bulkCreate(
      [
        {
          type: "expense",
          amount: 85.50,
          is_monthly: false,
          date_transaction: "2026-03-05",
          name: "Courses Carrefour",
          group_id: groups[0].id,
          category_id: categories[0].id,
        },
        {
          type: "expense",
          amount: 750.00,
          is_monthly: true,
          date_transaction: "2026-03-03",
          name: "Loyer mars",
          group_id: groups[0].id,
          category_id: categories[1].id,
        },
        {
          type: "income",
          amount: 1800.00,
          is_monthly: true,
          date_transaction: "2026-03-02",
          name: "Salaire principal",
          group_id: groups[1].id,
          category_id: categories[4].id,
        },
      ],
      { returning: true }
    );

    console.log("Transactions créées");

    console.log("Seeding terminé avec succès");
    console.log(`Groups : ${groups.length}`);
    console.log(`Users : ${users.length}`);
    console.log(`Categories : ${categories.length}`);
    console.log(`UserGroups : ${userGroups.length}`);
    console.log(`Budgets : ${budgets.length}`);
    console.log(`Transactions : ${transactions.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Erreur pendant le seeding :", error);
    process.exit(1);
  }
}

seed();