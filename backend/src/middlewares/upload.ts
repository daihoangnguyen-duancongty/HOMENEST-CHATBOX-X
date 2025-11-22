import multer from 'multer';

// Lưu file tạm vào memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });
