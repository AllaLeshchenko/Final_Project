import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { 
  followUser, 
  unfollowUser, 
  getFollowers, 
  getFollowing 
} from "../controllers/followController.js";

const router = express.Router();

// Подписка / отписка
router.post("/:id/follow", protect, followUser);
router.delete("/:id/unfollow", protect, unfollowUser);

// Получение подписчиков / подписок
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

export default router;
