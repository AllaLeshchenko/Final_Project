import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Регистрация
router.post("/register", registerUser);

// Логин
router.post("/login", loginUser);

// Проверка авторизации (если кука валидна -> вернём userId)
router.get("/me", protect, (req, res) => {
  try {
    res.status(200).json({ user: { id: req.userId } });
  } catch (error) {
    res.status(500).json({ message: "Error checking auth" });
  }
});

// Выход (очищаем куку)
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
});

export default router;
