import express from "express";
import { 
  searchUsers, 
  explorePosts, 
  getAllUsers, 
  getUserPosts 
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/", getAllUsers);                    // список всех пользователей
router.get("/users", searchUsers);               // поиск пользователей по имени/username
router.get("/explore", explorePosts);            // explore посты
router.get("/user/:userId/posts", getUserPosts); // посты конкретного пользователя

export default router;

