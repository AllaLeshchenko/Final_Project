import multer from 'multer';

const storage = multer.memoryStorage(); // сохраняем файл в память
export const upload = multer({ storage });