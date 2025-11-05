const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', movieRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Chill Movie API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Daftar user baru',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Lihat profile (perlu token)',
        'PATCH /api/auth/profile': 'Update profile (perlu token)'
      },
      movies: {
        'GET /api/movies': 'Ambil semua film (support filter, sort, search)',
        'GET /api/movie/:id': 'Ambil film berdasarkan ID',
        'POST /api/movie': 'Tambah film baru (perlu token admin)',
        'PATCH /api/movie/:id': 'Update data film (perlu token admin)',
        'DELETE /api/movie/:id': 'Hapus film (perlu token admin)'
      },
      upload: {
        'POST /api/upload/profile-image': 'Upload foto profil (perlu token)',
        'POST /api/upload/movie-image': 'Upload gambar film (perlu token admin)',
        'DELETE /api/upload/file/:filename': 'Hapus file (perlu token admin)'
      },
      queryParams: {
        movies: {
          search: 'Cari berdasarkan judul atau deskripsi',
          year: 'Filter berdasarkan tahun rilis',
          rating_min: 'Filter rating minimum',
          rating_max: 'Filter rating maksimum',
          language: 'Filter berdasarkan bahasa',
          sort: 'Sort by: title, rating, release_year, created_at',
          order: 'ASC atau DESC',
          limit: 'Jumlah data per halaman (default: 20)',
          page: 'Nomor halaman (default: 1)'
        }
      }
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`API endpoints tersedia di http://localhost:${PORT}/api`);
});
