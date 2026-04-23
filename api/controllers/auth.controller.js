import argon2 from "argon2";
import { User, UserGroup, Group } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ReturnResponseError } from "../utils/ReturnResponseError.js";

// fonction pour gérer l'inscription d'un nouvel utilisateur
export async function registerUser(req, res) {
  const { first_name, last_name, email, password } = req.body;

  const foundUser = await User.findOne({ where: { email } });

  if (foundUser) {
    throw new ReturnResponseError(StatusCodes.CONFLICT, "Username already exist");
  }

  const hashedPasword = await argon2.hash(password);
  // si aucun utilisateur n'est trouvé, hacher le mot de passe

  const registedUser = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPasword,
  });

  const token = jwt.sign(
    { id: registedUser.id, email: registedUser.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "24h" },
  );

  return res.status(StatusCodes.CREATED).json({ token, user: registedUser });
}

// fonction pour gérer la connexion d'un utilisateur existant
export async function loginUser(req, res) {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ where: { email } });

  if (!foundUser) {
    throw new ReturnResponseError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const validPassword = await argon2.verify(foundUser.password, password);
  // si un utilisateur est trouvé, vérifier que le mot de passe fourni correspond au mot de passe haché
  if (!validPassword) {
    throw new ReturnResponseError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const token = jwt.sign(
    // si les informations d'identification sont valides, générer un token JWT
    { id: foundUser.id, email: foundUser.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "24h" },
  );

  return res.status(StatusCodes.OK).json({ token, user: foundUser });
}

export async function getUser(req, res) {
  const user = await User.findByPk(req.user.id);
  res.status(StatusCodes.OK).json(user);
}

//---Supprime un utilisateur et supprime le/les comptes auxquels il appartient seulement si il est le seul membre---//
export async function deleteUser(req,res) {
  const userId = req.user.id;
  const user = await User.findByPk(userId);

  if(!user) {
    throw new ReturnResponseError(StatusCodes.UNAUTHORIZED, "User not found");
  }

  const affiliatedgroups = await Group.findAll({
    include: [{
      model: User,
      through: UserGroup,
      where: { id: userId }
    }]
  });

  for (const group of affiliatedgroups) {
    const membersCount = await UserGroup.count({
      where: { GroupId: group.id }
    });

    if (membersCount === 1) {
      await group.destroy();
    }
  }

  await user.destroy();

  return res.status(StatusCodes.NO_CONTENT).send();
}

