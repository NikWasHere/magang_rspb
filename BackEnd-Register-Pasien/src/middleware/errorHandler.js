import multer from 'multer';

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'UNEXPECTED_FIELD':
        return res.status(400).json({
          message: `Field '${err.field}' tidak diharapkan. Gunakan field 'photo', 'image', atau 'file' untuk upload.`,
          error: 'UNEXPECTED_FIELD',
          expectedFields: ['photo', 'image', 'file']
        });
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          message: 'File terlalu besar. Maksimal 5MB.',
          error: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          message: 'Terlalu banyak file. Maksimal 1 file.',
          error: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          message: 'File tidak diharapkan.',
          error: 'UNEXPECTED_FILE'
        });
      default:
        return res.status(400).json({
          message: err.message || 'Error saat upload file',
          error: err.code
        });
    }
  }
  
  // If it's not a Multer error, pass it to the next error handler
  next(err);
};

export const generalErrorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};