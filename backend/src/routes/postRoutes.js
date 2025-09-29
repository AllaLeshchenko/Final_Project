import express from 'express';
import { 
  getAllPosts,
  createPost, 
  deletePost,
  getPostById,
  updatePost,
  getUserPosts, 
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';


const router = express.Router();

// Создание поста (требуется авторизация)
router.post('/', protect, upload.single('image'), createPost);

// Получение поста по ID
router.get('/:id', getPostById);

// Получение всех постов (лента)
router.get('/', getAllPosts);

// Получение постов конкретного пользователя
router.get('/user/:userId', getUserPosts);

// Обновление поста (требуется авторизация)
router.put('/:id', protect, upload.single('image'), updatePost);

// Удаление поста (требуется авторизация)
router.delete('/:id', protect, deletePost);

export default router;

