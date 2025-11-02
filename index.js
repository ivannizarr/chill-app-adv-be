const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', movieRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Chill Movie API',
    endpoints: {
      'GET /api/movies': 'Ambil semua data film',
      'GET /api/movie/:id': 'Ambil film berdasarkan ID',
      'POST /api/movie': 'Tambah film baru',
      'PATCH /api/movie/:id': 'Update data film',
      'DELETE /api/movie/:id': 'Hapus film'
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