import { StatusCodes } from "http-status-codes";
import { Group, User, UserGroup } from "../models/index.js";
import { ReturnResponseError } from "../utils/ReturnResponseError.js";


// Récupère tous les groupes
export async function getAll(req, res) {
  const groups = await Group.findAll({
    where: {
      status: "accepted"
    }
  });
  return res.json(groups);
}

// Récupère un groupe par son id
export async function getById(req, res) {
  const group = await Group.findByPk(req.params.id);

  if (!group) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Group not found");
  }

  const membership = await UserGroup.findOne({
    where: {
      UserId: req.user.id,
      GroupId: req.params.id,
      status: "accepted"
    }
  });

  if (!membership) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "Access denied" });
  }

  return res.json(group);
}

// Crée un nouveau groupe
export async function create(req, res) {
  const group = await Group.create(req.body);

//le créateur du groupe doit automatiquement être ajouté dedans comme admin
  if (req.user?.id) {
    await UserGroup.create({
      UserId: req.user.id,
      GroupId: group.id,
      role: "admin",
      status: "accepted"
    });
  }

  return res.status(StatusCodes.CREATED).json(group);
}

// Supprime un groupe
export async function deleteById(req, res) {
  const deleted = await Group.destroy({
    where: { id: req.params.id }
  });

  if (deleted === 0) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Group not found");
  }

  return res.status(StatusCodes.NO_CONTENT).end();
}

// Récupère tous les groupes du user connecté
export async function getMe(req, res) {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Group,
        through: {
          attributes: ["role", "status"],
          where: {
            status: "accepted"
          }
        }
      }
    ]
  });

  if (!user) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "User not found");
  }

  return res.json(user.Groups);
}

// Ajoute un utilisateur dans un groupe à partir de son email
export async function addUserToGroup(req, res) {
  const group = await Group.findByPk(req.params.id);

  if (!group) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Group not found");
  }

  const user = await User.findOne({
    where: { email: req.body.email }
  });

  if (!user) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "User not found");
  }

  const existingMembership = await UserGroup.findOne({
    where: {
      UserId: user.id,
      GroupId: group.id
    }
  });

  if (existingMembership) {
    throw new ReturnResponseError(StatusCodes.CONFLICT, "User is already in this group");
  }

  const membership = await UserGroup.create({
    UserId: user.id,
    GroupId: group.id,
    role: "utilisateur",
    status: "pending"
  });

  return res.status(StatusCodes.CREATED).json(membership);
}

export async function countInvits(req, res) {
  const countInvits = await UserGroup.findAndCountAll({
    where: {
      UserId: req.params.id,
      status: "pending"
    },
    include: [
      {
        model: Group
      }
    ]
  })

  return res.json(countInvits)
}

export async function updateGroup(req, res) {

  const [updatedCount, updatedGroup] = await Group.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });

  if (updatedCount === 0) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Group not found");
  }
  return res.json(updatedGroup[0]);

}

// Modifie le rôle d'un utilisateur dans un groupe
export async function updateUserRole(req, res) {
  const membership = await UserGroup.findOne({
    where: {
      UserId: req.params.userId,
      GroupId: req.params.id
    }
  });

  if (!membership) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Membership not found");
  }

  membership.role = req.body.role ?? membership.role;
  membership.status = req.body.status ?? membership.status;

  await membership.save();

  return res.json(membership);
}

// Retire un utilisateur d'un groupe
export async function removeUserFromGroup(req, res) {
  const deleted = await UserGroup.destroy({
    where: {
      UserId: req.params.userId,
      GroupId: req.params.id
    }
  });

  if (deleted === 0) {
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Membership not found");
  }

  return res.status(StatusCodes.NO_CONTENT).end();
}

export async function countUserInGroup(req, res) {
  const { count } = await UserGroup.findAndCountAll({
    where: {
      GroupId: req.params.id,
      status: "accepted"
    },
  });

  if (count == 0){
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Not find");
  }

  return res.json(count)
}

export async function getStatus(req, res) {
  const userInGroup = await UserGroup.findAll({
    where:{
      GroupId: req.params.groupId,
      UserId: req.params.userID
    }
  })

  if(!userInGroup){
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "User in group not find");
  }
  return res.json(userInGroup)
}

export async function getAllUserInGroup(req,res){
  const allUserInGroup = await UserGroup.findAll({
    where: {
      GroupId: req.params.groupId,
      status: "accepted"
    },
    include: [
      {
        model: User
      }
    ]
  })

  if(!allUserInGroup){
    throw new ReturnResponseError(StatusCodes.NOT_FOUND, "Error users in group not find");
  }

  return res.json(allUserInGroup)
}
