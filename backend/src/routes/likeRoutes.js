// routes/likeRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { likePost, unlikePost } from "../controllers/likeController.js";

const router = express.Router();

router.post("/:postId", protect, likePost);     // лайк
router.delete("/:postId", protect, unlikePost); // анлайк

export default router;
