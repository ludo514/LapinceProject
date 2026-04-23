import { Router } from "express";
import * as groupController from "../controllers/group.controller.js";
import { checkData } from "../middlewares/middleware.js";
import { groupCreateSchema, groupUpdateSchema } from "../schemas/group.schema.js";
import { userGroupUpdateSchema } from "../schemas/userGroup.schema.js";

const router = Router();

router.get("/", groupController.getAll);
router.get("/me", groupController.getMe);
router.get("/:id", groupController.getById);
router.get("/countUser/:id", groupController.countUserInGroup);
router.get("/countInvits/:id", groupController.countInvits);
router.get("/getStatus/:groupId/:userID", groupController.getStatus)
router.get("/users/:groupId", groupController.getAllUserInGroup)

router.post("/", checkData(groupCreateSchema), groupController.create);
router.delete("/:id", groupController.deleteById);
router.patch("/:id", checkData(groupUpdateSchema), groupController.updateGroup);

router.post("/:id/users", groupController.addUserToGroup);
router.patch("/:id/users/:userId", checkData(userGroupUpdateSchema), groupController.updateUserRole);
router.delete("/:id/users/:userId", groupController.removeUserFromGroup);

export default router;
