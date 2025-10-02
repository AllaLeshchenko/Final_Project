import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addComment, deleteComment, getPostComments } from "../controllers/commentController.js";

const router = express.Router();

// Добавление комментария
router.post("/:postId", protect, addComment);

// Получить все комментарии к посту
router.get("/:postId", protect, getPostComments);

// Удаление комментария
router.delete("/:commentId", protect, deleteComment);

export default router;

