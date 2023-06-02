import "dotenv/config";
import { cleanEnv, str, num } from "envalid";

export const config = cleanEnv(process.env, {
  MONGO_URI: str(),
  NODE_ENV: str({
    choices: ["production", "development"],
    default: "development",
  }),
  PORT: num({
    default: 8000,
  }),
  JWT_SECRET: str({
    default: "uhdgufh37y378rhufdjf",
  }),
});
