import express from "express";
import cors from "cors";
import "dotenv/config";
import { config } from "./utils/config";

// error middleware
import { errorMiddleWare } from "./middlewares/error.middleware";

import { connectDB } from "./db/connection";

// routenames
import authRoutes from "./routes/auth.route";
import taskRoutes from "./routes/task.route";

const app = express();

// middlewares
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mongo connection
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Hello From Api!");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Using Error Middleware
app.use(errorMiddleWare);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
