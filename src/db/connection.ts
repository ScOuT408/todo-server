import mongoose from "mongoose";
import { config } from "../utils/config";

const URI = config.MONGO_URI;

export const connectDB = async () => {
  try {
    if (config.NODE_ENV === "development") {
      mongoose.set("debug", true);
    }

    const { connection } = await mongoose.connect(URI);
    console.log(`Connected to MongoDB at ${connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
