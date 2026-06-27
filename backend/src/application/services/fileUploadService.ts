import multer from 'multer';
import { Request, Response } from 'express';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: fileFilter,
});

export const uploadFile = (req: Request, res: Response) => {
  const uploader = upload.single('file');
  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // Other possible errors
      return res.status(500).json({ error: err.message });
    }

    // Check if the file was rejected by the file filter
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Invalid file type, only PDF and DOCX are allowed!' });
    }
    // If everything is ok, respond with the file path and file type
    res.status(200).json({
      filePath: req.file.path,
      fileType: req.file.mimetype, // File type is appended here
    });
  });
};
