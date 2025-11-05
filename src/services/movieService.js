const db = require('../config/database');

class MovieService {
  async getAllMovies(filters = {}) {
    try {
      let query = 'SELECT DISTINCT m.* FROM movies m';
      let whereConditions = ' WHERE 1=1';
      const params = [];

      if (filters.genre) {
        query += ' INNER JOIN movie_genres mg ON m.id = mg.movie_id';
        query += ' INNER JOIN genres g ON mg.genre_id = g.id';
        whereConditions += ' AND (g.name = ? OR g.slug = ?)';
        params.push(filters.genre, filters.genre);
      }

      query += whereConditions;

      if (filters.search) {
        query += ' AND (m.title LIKE ? OR m.description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      if (filters.year) {
        query += ' AND m.release_year = ?';
        params.push(filters.year);
      }

      if (filters.rating_min) {
        query += ' AND m.rating >= ?';
        params.push(filters.rating_min);
      }

      if (filters.rating_max) {
        query += ' AND m.rating <= ?';
        params.push(filters.rating_max);
      }

      if (filters.language) {
        query += ' AND m.language = ?';
        params.push(filters.language);
      }

      const sortColumn = filters.sort || 'id';
      const sortOrder = filters.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const allowedSortColumns = ['title', 'rating', 'release_year', 'created_at', 'id'];

      if (allowedSortColumns.includes(sortColumn)) {
        query += ` ORDER BY m.${sortColumn} ${sortOrder}`;
      } else {
        query += ' ORDER BY m.id DESC';
      }

      const limit = parseInt(filters.limit) || 20;
      const page = parseInt(filters.page) || 1;
      const offset = (page - 1) * limit;

      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);
      let countQuery = 'SELECT COUNT(DISTINCT m.id) as total FROM movies m';

      if (filters.genre) {
        countQuery += ' INNER JOIN movie_genres mg ON m.id = mg.movie_id';
        countQuery += ' INNER JOIN genres g ON mg.genre_id = g.id';
      }

      countQuery += ' WHERE 1=1';

      if (filters.genre) {
        countQuery += ' AND (g.name = ? OR g.slug = ?)';
      }
      if (filters.search) {
        countQuery += ' AND (m.title LIKE ? OR m.description LIKE ?)';
      }
      if (filters.year) {
        countQuery += ' AND m.release_year = ?';
      }
      if (filters.rating_min) {
        countQuery += ' AND m.rating >= ?';
      }
      if (filters.rating_max) {
        countQuery += ' AND m.rating <= ?';
      }
      if (filters.language) {
        countQuery += ' AND m.language = ?';
      }

      const [countResult] = await db.query(countQuery, params.slice(0, -2));

      return {
        data: rows,
        pagination: {
          total: countResult[0].total,
          page,
          limit,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      };
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