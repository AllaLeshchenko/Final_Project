import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { likePost, unlikePost, getPostLikes } from "../controllers/likeController.js";

const router = express.Router();

// Лайк поста
router.post("/:postId/like", protect, likePost);

// Удаление лайка
router.delete("/:postId/unlike", protect, unlikePost);

// Просмотр всех лайков
router.get("/:postId",protect, getPostLikes);

export default router;

