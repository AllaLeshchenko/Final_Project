// routes/commentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/:postId", protect, addComment);         // добавить комментарий
router.delete("/:commentId", protect, deleteComment); // удалить комментарий

export default router;
