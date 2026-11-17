// Single swap point for the storage provider. Local disk for now; point
// this at an s3Storage.js (same saveFile/deleteFile interface) later.
module.exports = require('./localStorage');
