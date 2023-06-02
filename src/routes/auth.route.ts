import express from "express";
import {
  getMyProfile,
  login,
  register,
} from "./../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validator/auth.validator";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", isAuthenticated, getMyProfile);

export default router;
