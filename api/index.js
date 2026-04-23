import "dotenv/config";

import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import sequelize from "./config/database.js";

import groupRouter from "./routers/group.router.js";
import categoryRouter from "./routers/category.router.js";
import budgetRouter from "./routers/budget.router.js";
import transactionRouter from "./routers/transaction.router.js";
import authRouter from "./routers/auth.router.js";
import { checkAuth } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(xss());
app.use(express.json());

app.use("/auth", authRouter);

app.use(checkAuth); //On place le middleware d'authentification juste apres la route de connexion/inscription afin de securiser toutes les routes suivante

app.use("/groups", groupRouter);
app.use("/categories", categoryRouter);
app.use("/budgets", budgetRouter);
app.use("/transactions", transactionRouter);

//Route de test
app.get("/", (req, res) => {
  res.send("API apolapince OK");
});

app.use(errorHandler);


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à PostgreSQL réussie");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur :", error);
  }
}

startServer();