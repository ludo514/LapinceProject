import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { Budget, Group, User } from "../models/index.js";
import { ReturnResponseError } from "../utils/ReturnResponseError.js";

function validateBudgetPayload(body, isPartial = false) {
  const errors = [];

  if (!isPartial || body.amount !== undefined) {
    if (typeof body.amount !== "number" || Number.isNaN(body.amount)) {
      errors.push("amount must be a number");
    } else if (body.amount <= 0) {
      errors.push("amount must be greater than 0");
    }
  }

  if (!isPartial || body.group_id !== undefined) {
    if (!Number.isInteger(body.group_id)) {
      errors.push("group_id must be an integer");
    }
  }

  if (!isPartial || body.is_monthly !== undefined) {
    if (typeof body.is_monthly !== "boolean") {
      errors.push("is_monthly must be a boolean");
    }
  }

  if (!isPartial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      errors.push("name must be a non-empty string");
    }
  }

  if (!isPartial || body.date_budget !== undefined) {
    const isValidDate =
      typeof body.date_budget === "string" &&
      !Number.isNaN(new Date(body.date_budget).getTime());

    if (!isValidDate) {
      errors.push("date_budget must be a valid date");
    }
  }

  return errors;
}

async function userBelongsToGroup(userId, groupId) {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Group,
        where: { id: groupId },
        through: { attributes: [] }
      }
    ]
  });

  return !!user && user.Groups.length > 0;
}

// Récupère tous les budgets accessibles au user
export async function getAll(req, res) {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Group,
        through: { attributes: [] }
      }
    ]
  });

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "User not found" });
  }

  const userGroupIds = user.Groups.map(group => group.id);

  const where = {
    group_id: {
      [Op.in]: userGroupIds
    }
  };

  if (req.query.group_id) {
    const groupId = Number(req.query.group_id);

    if (!Number.isInteger(groupId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "group_id must be an integer" });
    }

    if (!userGroupIds.includes(groupId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Access denied to this group" });
    }

    where.group_id = groupId;
  }

  const budgets = await Budget.findAll({
    where,
    include: "group"
  });

  return res.json(budgets);
}

// Récupère un budget par son id
export async function getById(req, res) {
  const budget = await Budget.findByPk(req.params.id, {
    include: "group"
  });

  if (!budget) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Budget not found");
  }

  const hasAccess = await userBelongsToGroup(req.user.id, budget.group_id);

  if (!hasAccess) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "Access denied" });
  }

  return res.json(budget);
}

// Crée un nouveau budget
export async function create(req, res) {
  const errors = validateBudgetPayload(req.body);

  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors });
  }

  const group = await Group.findByPk(req.body.group_id);

  if (!group) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Group not found");
  }

  const hasAccess = await userBelongsToGroup(req.user.id, req.body.group_id);

  if (!hasAccess) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "Access denied to this group" });
  }

  const budget = await Budget.create(req.body);

  return res.status(StatusCodes.CREATED).json(budget);
}

// Modifie un budget existant
export async function update(req, res) {
  const errors = validateBudgetPayload(req.body, true);

  if (updatedCount === 0) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Budget not found");
  }

  const hasAccess = await userBelongsToGroup(req.user.id, budget.group_id);

  if (!hasAccess) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "Access denied" });
  }

  if (req.body.group_id !== undefined && req.body.group_id !== budget.group_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "group_id cannot be changed" });
  }

  await budget.update(req.body);

  return res.json(budget);
}

// Supprime un budget
export async function deleteById(req, res) {
  const budget = await Budget.findByPk(req.params.id);

  if (!budget) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Budget not found");
  }

  const hasAccess = await userBelongsToGroup(req.user.id, budget.group_id);

  if (!hasAccess) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "Access denied" });
  }

  await budget.destroy();

  return res.status(StatusCodes.NO_CONTENT).end();
}

// Récupère les budgets des groupes du user connecté
export async function getMe(req, res) {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Group,
        include: [
          {
            model: Budget,
            as: "budgets"
          }
        ]
      }
    ]
  });

  if (!user) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "User not found");
  }

  const budgets = user.Groups.flatMap(group => group.budgets || []);

  return res.json(budgets);
}

// Duplique tous les budgets pour le mois suivant en une seule passe
export async function createNextForAll(req, res) {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Group,
        include: [
          {
            model: Budget,
            as: "budgets"
          }
        ]
      }
    ]
  });

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "User not found" });
  }

  const budgets = user.Groups.flatMap(group => group.budgets || []);

  if (budgets.length === 0) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "No budgets found");
  }

  const candidates = budgets.map(budget => {
    const currentDate = budget.date_budget
      ? new Date(budget.date_budget)
      : new Date();

    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    return {
      amount: budget.amount,
      is_monthly: budget.is_monthly,
      date_budget: nextDate.toISOString().split("T")[0],
      name: budget.name,
      group_id: budget.group_id
    };
  });

  const existingBudgets = await Budget.findAll({
    where: {
      [Op.or]: candidates.map(c => ({
        group_id: c.group_id,
        date_budget: c.date_budget
      }))
    },
    attributes: ["group_id", "date_budget"]
  });

  const existingSet = new Set(
    existingBudgets.map(b => `${b.group_id}_${b.date_budget}`)
  );

  const toCreate = candidates.filter(
    c => !existingSet.has(`${c.group_id}_${c.date_budget}`)
  );

  if (toCreate.length === 0) {
    throw new ReturnResponseError(StatusCodes.CONFLICT, "All next-month budgets already exist");
  }

  const newBudgets = await Budget.bulkCreate(toCreate);

  return res.status(StatusCodes.CREATED).json(newBudgets);
}

// Duplique un budget pour le mois suivant
export async function createNext(req, res) {
  const budget = await Budget.findByPk(req.params.id);

  if (!budget) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Budget not found");
  }

  const hasAccess = await userBelongsToGroup(req.user.id, budget.group_id);

  if (!hasAccess) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "Access denied" });
  }

  const currentDate = budget.date_budget
    ? new Date(budget.date_budget)
    : new Date();

  const nextDate = new Date(currentDate);
  nextDate.setMonth(nextDate.getMonth() + 1);

  const formattedNextDate = nextDate.toISOString().split("T")[0];

  const existingBudget = await Budget.findOne({
    where: {
      group_id: budget.group_id,
      date_budget: formattedNextDate
    }
  });

  if (existingBudget) {
    throw new ReturnResponseError(StatusCodes.CONFLICT, "A budget already exists for the next month");
  }

  const newBudget = await Budget.create({
    amount: budget.amount,
    is_monthly: budget.is_monthly,
    date_budget: formattedNextDate,
    name: budget.name,
    group_id: budget.group_id
  });

  return res.status(StatusCodes.CREATED).json(newBudget);
}