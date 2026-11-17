const express = require('express');
const multer = require('multer');
const storage = require('../storage');

const router = express.Router();

const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error('Unsupported file type. Only PNG, JPEG, and WEBP are allowed.'));
      return;
    }
    cb(null, true);
  },
});

router.post('/', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const isTooLarge = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE';
      return res.status(isTooLarge ? 413 : 400).json({
        error: isTooLarge
          ? `File is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`
          : err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { filename, url } = storage.saveFile(req.file.buffer, req.file.mimetype);
    res.status(201).json({ filename, url });
  });
});

module.exports = router;
