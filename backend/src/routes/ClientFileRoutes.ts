// backend/routes/ClientFileRoutes.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ClientModel } from '../models/Client';
import { ClientFileModel } from '../models/ClientFileModel';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '../config/cloudinary';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // lưu tạm trong RAM

// Middleware: kiểm tra client login
async function checkClient(req: Request, res: Response, next: Function) {
  const loggedUser: any = req.body._user;
  if (!loggedUser || loggedUser.role !== 'client')
    return res.status(403).json({ error: 'Forbidden' });
  req.body.clientId = loggedUser.clientId;
  next();
}

// Upload file train AI
router.post(
  '/upload',
  checkClient,
  upload.single('file'), // field name là "file"
  async (req: Request, res: Response) => {
    try {
      const clientId = req.body.clientId;
      const file = req.file;

      if (!file) return res.status(400).json({ error: 'No file uploaded' });

      const client = await ClientModel.findOne({ clientId });
      if (!client) return res.status(404).json({ error: 'Client not found' });

      // Kiểm tra quota max_files
      const maxFiles = client.subscription_plan?.max_files ?? 5;
      const uploadedFilesCount = await ClientFileModel.countDocuments({ clientId });

      if (uploadedFilesCount >= maxFiles) {
        return res.status(403).json({
          error: 'Bạn đã đạt giới hạn số file train AI cho gói này',
          limit: maxFiles,
        });
      }

      // Upload lên Cloudinary
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `clients/${clientId}/files` },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(file.buffer);
      });

      // Lưu vào DB
      const clientFile = await ClientFileModel.create({
        clientId,
        fileName: file.originalname,
        fileUrl: result.secure_url,
        status: 'ready', // mặc định sẵn sàng train
      });

      return res.json({ ok: true, file: clientFile });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
