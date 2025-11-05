const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadProfile, uploadMovie } = require('../config/multer');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post(
  '/upload',
  authMiddleware,
  uploadProfile.single('file'),
  uploadController.generalUpload
);

router.post(
  '/movie-image',
  authMiddleware,
  roleMiddleware('admin'),
  uploadMovie.single('image'),
  uploadController.uploadMovieImage
);

router.delete(
  '/file/:filename',
  authMiddleware,
  roleMiddleware('admin'),
  uploadController.deleteFile
);

module.exports = router;