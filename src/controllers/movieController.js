const movieService = require('../services/movieService');

class MovieController {
  async getAllMovies(req, res) {
    try {
      const filters = {
        search: req.query.search,
        year: req.query.year,
        genre: req.query.genre,
        rating_min: req.query.rating_min,
        rating_max: req.query.rating_max,
        language: req.query.language,
        sort: req.query.sort,
        order: req.query.order,
        limit: req.query.limit,
        page: req.query.page
      };

      const result = await movieService.getAllMovies(filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Berhasil mengambil data film'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data film',
        error: error.message
      });
    }
  }

  async getMovieById(req, res) {
    try {
      const { id } = req.params;
      const movie = await movieService.getMovieById(id);

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Film tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        data: movie,
        message: 'Berhasil mengambil data film'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data film',
        error: error.message
      });
    }
  }

  async createMovie(req, res) {
    try {
      const movieData = req.body;

      if (!movieData.title) {
        return res.status(400).json({
          success: false,
          message: 'Judul film harus diisi'
        });
      }

      const newMovie = await movieService.createMovie(movieData);
      res.status(201).json({
        success: true,
        data: newMovie,
        message: 'Film berhasil ditambahkan'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menambahkan film',
        error: error.message
      });
    }
  }

  async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const movieData = req.body;

      if (!movieData.title) {
        return res.status(400).json({
          success: false,
          message: 'Judul film harus diisi'
        });
      }

      const updatedMovie = await movieService.updateMovie(id, movieData);

      if (!updatedMovie) {
        return res.status(404).json({
          success: false,
          message: 'Film tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedMovie,
        message: 'Film berhasil diperbarui'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal memperbarui film',
        error: error.message
      });
    }
  }

  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      const deleted = await movieService.deleteMovie(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Film tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Film berhasil dihapus'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus film',
        error: error.message
      });
    }
  }
}

module.exports = new MovieController();