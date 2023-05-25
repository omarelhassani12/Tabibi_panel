const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Set the maximum file size in bytes (e.g., 10MB)
    },
})

module.exports = upload;