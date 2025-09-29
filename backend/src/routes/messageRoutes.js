import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getChatHistory } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:recipientId", protect, getChatHistory);

export default router;
