import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { checkData } from "../middlewares/middleware.js";
import { categoryCreateSchema } from "../schemas/category.schema.js";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

router.delete("/:id", categoryController.deleteById);

router.post("/", checkData(categoryCreateSchema), categoryController.create);

export default router;
