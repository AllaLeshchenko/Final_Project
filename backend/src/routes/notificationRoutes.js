import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Получить все уведомления
router.get("/", protect, getNotifications);

// Отметить все как прочитанные
router.put("/read-all", protect, markAllAsRead);

// Удалить одно уведомление
router.delete("/:id", protect, deleteNotification);

export default router;
