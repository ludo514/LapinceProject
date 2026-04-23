import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller.js";
import { checkData } from "../middlewares/middleware.js";
import { transactionCreateSchema } from "../schemas/transaction.schema.js";

const router = Router();

router.get("/:id", transactionController.getAll);
// router.get("/:id", transactionController.getById);
router.get("/sumTransac/:groupId", transactionController.getSumTransac)
router.delete("/:id", transactionController.deleteById);

router.post("/", checkData(transactionCreateSchema), transactionController.create);

export default router;
