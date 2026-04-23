import { Router } from "express";
import * as budgetController from "../controllers/budget.controller.js";
import { checkData } from "../middlewares/middleware.js";
import { budgetCreateSchema, budgetUpdateSchema } from "../schemas/budget.schema.js";

const router = Router();

router.get("/", budgetController.getAll);
router.get("/me", budgetController.getMe);
router.get("/:id", budgetController.getById);

router.post("/", checkData(budgetCreateSchema), budgetController.create);
router.patch("/:id", checkData(budgetUpdateSchema), budgetController.update);
router.delete("/:id", budgetController.deleteById);
router.post("/:id/next", budgetController.createNext);
router.post("/next", budgetController.createNextForAll);

export default router;
