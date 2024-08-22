const multer = require('multer');
const path = require('path');

// Configure storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Images'); // Specify your upload directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using the original name and current timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg|ico/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// Set file size limit (optional)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB (adjust as needed)
};

// Configure multer with the storage, file filter, and limits
const uploadBrandSettings = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = uploadBrandSettings;
