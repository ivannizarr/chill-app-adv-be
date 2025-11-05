const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { movieValidation } = require('../middleware/validation');

router.get('/movies', authMiddleware, movieValidation.search, movieController.getAllMovies);

router.get('/movie/:id', movieValidation.getById, movieController.getMovieById);

router.post(
  '/movie',
  authMiddleware,
  roleMiddleware('admin'),
  movieValidation.create,
  movieController.createMovie
);

router.patch(
  '/movie/:id',
  authMiddleware,
  roleMiddleware('admin'),
  movieValidation.update,
  movieController.updateMovie
);

router.delete(
  '/movie/:id',
  authMiddleware,
  roleMiddleware('admin'),
  movieValidation.delete,
  movieController.deleteMovie
);

module.exports = router;
