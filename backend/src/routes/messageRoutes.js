import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/messages/:userId → история с конкретным пользователем
router.get("/:userId", protect, getMessages);

export default router;


