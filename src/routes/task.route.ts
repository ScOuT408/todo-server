import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.put("/:id", isAuthenticated, updateTask);
router.get("/", isAuthenticated, getTasks);
router.post("/add", isAuthenticated, addTask);
router.delete("/:id", isAuthenticated, deleteTask);

export default router;
