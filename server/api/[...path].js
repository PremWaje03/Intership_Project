import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let dbInitPromise;

const ensureDbConnection = async () => {
  if (!dbInitPromise) {
    dbInitPromise = connectDB();
  }
  await dbInitPromise;
};

export default async function handler(req, res) {
  await ensureDbConnection();
  return app(req, res);
}
