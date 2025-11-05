const db = require('../config/database');

const buildMovieFilters = (filters = {}) => {
  const joins = [];
  const conditions = [];
  const params = [];

  if (filters.genre) {
    joins.push('INNER JOIN movie_genres mg ON m.id = mg.movie_id');
    joins.push('INNER JOIN genres g ON mg.genre_id = g.id');
    conditions.push('(g.name = ? OR g.slug = ?)');
    params.push(filters.genre, filters.genre);
  }

  if (filters.search) {
    conditions.push('(m.title LIKE ? OR m.description LIKE ?)');
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (filters.year) {
    conditions.push('m.release_year = ?');
    params.push(filters.year);
  }

  if (filters.rating_min) {
    conditions.push('m.rating >= ?');
    params.push(filters.rating_min);
  }

  if (filters.rating_max) {
    conditions.push('m.rating <= ?');
    params.push(filters.rating_max);
  }

  if (filters.language) {
    conditions.push('m.language = ?');
    params.push(filters.language);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return {
    joins: joins.join(' '),
    whereClause,
    params
  };
};

class MovieService {
  async getAllMovies(filters = {}) {
    try {
      const { joins, whereClause, params } = buildMovieFilters(filters);

      let query = `SELECT DISTINCT m.* FROM movies m ${joins} ${whereClause}`;
      const sortColumn = filters.sort || 'id';
      const sortOrder = filters.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const allowedSortColumns = ['title', 'rating', 'release_year', 'created_at', 'id'];

      if (allowedSortColumns.includes(sortColumn)) {
        query += ` ORDER BY m.${sortColumn} ${sortOrder}`;
      } else {
        query += ' ORDER BY m.id DESC';
      }

      const limit = parseInt(filters.limit, 10) || 20;
      const page = parseInt(filters.page, 10) || 1;
      const offset = (page - 1) * limit;

      const queryParams = [...params, limit, offset];
      query += ' LIMIT ? OFFSET ?';

      const [rows] = await db.query(query, queryParams);
      const countQuery = `SELECT COUNT(DISTINCT m.id) as total FROM movies m ${joins} ${whereClause}`;
      const [countResult] = await db.query(countQuery, params);

      return {
        data: rows,
        pagination: {
          total: countResult[0]?.total || 0,
          page,
          limit,
          totalPages: Math.ceil((countResult[0]?.total || 0) / limit) || 0
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
