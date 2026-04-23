import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { checkData } from "../middlewares/middleware.js";
import { userCreateSchema } from "../schemas/user.schema.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", checkData(userCreateSchema), authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", checkAuth, authController.getUser);
router.delete("/me", checkAuth, authController.deleteUser);

export default router;
