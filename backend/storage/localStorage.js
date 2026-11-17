const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const EXTENSION_BY_MIME_TYPE = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

/**
 * Local-disk implementation of the storage interface. Swap this module out
 * (e.g. for an s3Storage.js with the same saveFile/deleteFile shape) via
 * storage/index.js when moving to a cloud provider.
 */
function saveFile(buffer, mimeType) {
  const extension = EXTENSION_BY_MIME_TYPE[mimeType] || '';
  const filename = `${crypto.randomUUID()}${extension}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
  return { filename, url: `/uploads/${filename}` };
}

function deleteFile(filename) {
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = { saveFile, deleteFile, UPLOADS_DIR };
