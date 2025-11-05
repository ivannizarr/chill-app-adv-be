const fs = require('fs').promises;
const path = require('path');

class UploadController {
  async generalUpload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File tidak ditemukan'
        });
      }

      const fileUrl = `/uploads/profiles/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'File berhasil diupload',
        data: {
          fileUrl: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengupload file',
        error: error.message
      });
    }
  }

  async uploadMovieImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File gambar tidak ditemukan'
        });
      }

      const imageUrl = `/uploads/movies/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Gambar film berhasil diupload',
        data: {
          imageUrl: imageUrl,
          filename: req.file.filename
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengupload gambar film',
        error: error.message
      });
    }
  }

  async deleteFile(req, res) {
    try {
      const filename = req.params.filename;
      const profilePath = path.join(__dirname, '../..', 'uploads', 'profiles', filename);
      const moviePath = path.join(__dirname, '../..', 'uploads', 'movies', filename);

      try {
        await fs.unlink(profilePath);
      } catch (error) {
        try {
          await fs.unlink(moviePath);
        } catch (error2) {
          return res.status(404).json({
            success: false,
            message: 'File tidak ditemukan'
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'File berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus file',
        error: error.message
      });
    }
  }
}

module.exports = new UploadController();