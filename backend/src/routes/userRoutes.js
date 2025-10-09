import express from 'express';
import multer from 'multer';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multer хранит файлы в памяти (не на диске)
const upload = multer({ storage: multer.memoryStorage() });

// Получение профиля по ID
router.get('/profile/:id', protect, getProfile);

// Обновление профиля (с поддержкой загрузки изображения)
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

export default router;