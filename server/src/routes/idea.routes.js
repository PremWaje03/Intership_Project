import { Router } from "express";
import {
  addComment,
  createIdea,
  deleteIdea,
  getIdeaById,
  getIdeas,
  getStats,
  likeIdea,
  updateIdea
} from "../controllers/idea.controller.js";

const router = Router();

router.get("/stats", getStats);
router.get("/", getIdeas);
router.get("/:id", getIdeaById);
router.post("/", createIdea);
router.put("/:id", updateIdea);
router.delete("/:id", deleteIdea);
router.post("/:id/like", likeIdea);
router.post("/:id/comments", addComment);

export default router;
