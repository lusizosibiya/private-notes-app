import express from "express";
import {
  signUp,
  login,
  getCurrentUser,
  logout,
  refreshSession,
} from "../controllers/authController.js";
import { authValidator } from "../validation/authValidator.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/me", authValidator, getCurrentUser);
router.post("/logout", authValidator, logout);
router.post("/refresh", refreshSession);

export default router;
