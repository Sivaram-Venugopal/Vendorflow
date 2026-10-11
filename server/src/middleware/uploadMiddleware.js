import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads/documents directory exists
const uploadDir = path.resolve('uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique timestamped filename to prevent naming collisions
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBasename = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBasename}-${uniqueSuffix}${ext}`);
  },
});

// File filter for KYC and compliance documents
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF, JPEG, and PNG documents are allowed.'
      )
    );
  }
};

// 10MB file size limit
export const uploadKYCDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

export default uploadKYCDocument;
