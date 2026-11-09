import express from "express";
import { authValidator } from "../validation/authValidator.js";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", authValidator, getNotes);
router.post("/", authValidator, createNote);
router.put("/:id", authValidator, updateNote);
router.delete("/:id", authValidator, deleteNote);

export default router;
