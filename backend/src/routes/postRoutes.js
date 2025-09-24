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

// Получение всех постов (лента)
router.get('/', getAllPosts);

// Создание поста (требуется авторизация)
router.post('/', protect, upload.single('image'), createPost);

// Удаление поста (требуется авторизация)
router.delete('/:id', protect, deletePost);

// Получение поста по ID
router.get('/:id', getPostById);

// Обновление поста (требуется авторизация)
router.put('/:id', protect, upload.single('image'), updatePost);

// Получение постов конкретного пользователя
router.get('/user/:userId', getUserPosts);

export default router;

