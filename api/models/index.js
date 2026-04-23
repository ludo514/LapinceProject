import { Category } from "./category.model.js";
import { Transaction } from "./transaction.model.js";
import { UserGroup } from "./userGroup.model.js";
import { User } from "./user.model.js";
import { Group } from "./group.model.js";
import { Budget } from "./budget.model.js";



User.belongsToMany(Group, { through: UserGroup }) // ajout dans la table de liaison UserGroup les clées étrangères UserId et GroupId
Group.belongsToMany(User, { through: UserGroup })

UserGroup.belongsTo(User)
UserGroup.belongsTo(Group)

Group.hasMany(Transaction, { // ajout de la relation entre Group et Transaction, un groupe peut avoir plusieurs transactions
    as: "transactions",
    foreignKey: {
        name: "group_id",
        allowNull: false
    }
})

Transaction.belongsTo(Group, { // ajout de la relation entre Transaction et Group, une transaction appartient à un groupe
    as: "group",
    foreignKey: "group_id"
})

Group.hasMany(Budget, { // ajout de la relation entre Group et Budget, un groupe peut avoir plusieurs budgets
    as: "budgets",
    foreignKey: {
        name: "group_id",
        allowNull: false // je l'ai modif en false car sinon un budget sans groupe est possible.
    }
})

Budget.belongsTo(Group, { // ajout de la relation entre Budget et Group, un budget appartient à un groupe
    as: "group",
    foreignKey: "group_id"
})

Category.hasMany(Transaction, { // ajout de la relation entre Category et Transaction, une catégorie peut avoir plusieurs transactions
    as: "transactions",
    foreignKey: {
        name: "category_id",
        allowNull: false
    },
    onDelete: "RESTRICT"
})

Transaction.belongsTo(Category, { // ajout de la relation entre Transaction et Category, une transaction appartient à une catégorie
    as: "category",
    foreignKey: "category_id"
})

// Exporter nos modèles
export { User, Group, Transaction, Category, Budget, UserGroup };
