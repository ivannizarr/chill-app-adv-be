const db = require('../config/database');

class MovieService {
  async getAllMovies() {
    try {
      const [rows] = await db.query('SELECT * FROM movies ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async getMovieById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async createMovie(movieData) {
    const { title, description, release_year, duration_min, rating, language, image_url, trailer_url } = movieData;
    try {
      const [result] = await db.query(
        'INSERT INTO movies (title, description, release_year, duration_min, rating, language, image_url, trailer_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, release_year, duration_min, rating, language, image_url, trailer_url]
      );
      return { id: result.insertId, ...movieData };
    } catch (error) {
      throw error;
    }
  }

  async updateMovie(id, movieData) {
    const { title, description, release_year, duration_min, rating, language, image_url, trailer_url } = movieData;
    try {
      const [result] = await db.query(
        'UPDATE movies SET title = ?, description = ?, release_year = ?, duration_min = ?, rating = ?, language = ?, image_url = ?, trailer_url = ? WHERE id = ?',
        [title, description, release_year, duration_min, rating, language, image_url, trailer_url, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }
      return { id: Number(id), ...movieData };
    } catch (error) {
      throw error;
    }
  }

  async deleteMovie(id) {
    try {
      const [result] = await db.query('DELETE FROM movies WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MovieService();