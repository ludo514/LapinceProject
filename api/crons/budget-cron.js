import cron from "node-cron";
import "dotenv/config";

cron.schedule("* * *",async () => {
    await fetch(`http://localhost:${process.env.PORT}/budget/next`)
})