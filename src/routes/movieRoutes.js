const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authMiddleware } = require('../middleware/auth');

router.get('/movies', authMiddleware, movieController.getAllMovies);

router.get('/movie/:id', movieController.getMovieById);

router.post('/movie', authMiddleware, movieController.createMovie);

router.patch('/movie/:id', authMiddleware, movieController.updateMovie);

router.delete('/movie/:id', authMiddleware, movieController.deleteMovie);

module.exports = router;