const { body, param, query } = require('express-validator');

const authValidation = {
  register: [
    body('fullname')
      .notEmpty()
      .withMessage('Nama lengkap harus diisi')
      .isLength({ min: 3 })
      .withMessage('Nama lengkap minimal 3 karakter'),

    body('username')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Username minimal 3 karakter')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username hanya boleh berisi huruf, angka, dan underscore'),

    body('email')
      .notEmpty()
      .withMessage('Email harus diisi')
      .isEmail()
      .withMessage('Format email tidak valid')
      .normalizeEmail(),

    body('password')
      .notEmpty()
      .withMessage('Password harus diisi')
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 karakter')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password harus mengandung huruf besar, huruf kecil, dan angka')
  ],

  login: [
    body('email')
      .notEmpty()
      .withMessage('Email harus diisi')
      .isEmail()
      .withMessage('Format email tidak valid')
      .normalizeEmail(),

    body('password')
      .notEmpty()
      .withMessage('Password harus diisi')
  ],

  updateProfile: [
    body('fullname')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Nama lengkap minimal 3 karakter'),

    body('username')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Username minimal 3 karakter')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username hanya boleh berisi huruf, angka, dan underscore'),

    body('email')
      .optional()
      .isEmail()
      .withMessage('Format email tidak valid')
      .normalizeEmail(),

    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 karakter')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password harus mengandung huruf besar, huruf kecil, dan angka')
  ]
};

const movieValidation = {
  create: [
    body('title')
      .notEmpty()
      .withMessage('Judul film harus diisi')
      .isLength({ min: 1, max: 255 })
      .withMessage('Judul film maksimal 255 karakter'),

    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Deskripsi maksimal 1000 karakter'),

    body('release_year')
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
      .withMessage('Tahun rilis tidak valid'),

    body('duration_min')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Durasi harus berupa angka positif'),

    body('rating')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('Rating harus antara 0-10'),

    body('language')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Bahasa maksimal 50 karakter'),

    body('image_url')
      .optional()
      .isURL()
      .withMessage('Format URL gambar tidak valid'),

    body('trailer_url')
      .optional()
      .isURL()
      .withMessage('Format URL trailer tidak valid')
  ],

  update: [
    param('id')
      .isInt()
      .withMessage('ID tidak valid'),

    body('title')
      .optional()
      .isLength({ min: 1, max: 255 })
      .withMessage('Judul film maksimal 255 karakter'),

    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Deskripsi maksimal 1000 karakter'),

    body('release_year')
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
      .withMessage('Tahun rilis tidak valid'),

    body('duration_min')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Durasi harus berupa angka positif'),

    body('rating')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('Rating harus antara 0-10'),

    body('language')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Bahasa maksimal 50 karakter'),

    body('image_url')
      .optional()
      .isURL()
      .withMessage('Format URL gambar tidak valid'),

    body('trailer_url')
      .optional()
      .isURL()
      .withMessage('Format URL trailer tidak valid')
  ],

  getById: [
    param('id')
      .isInt()
      .withMessage('ID tidak valid')
  ],

  delete: [
    param('id')
      .isInt()
      .withMessage('ID tidak valid')
  ],

  search: [
    query('search')
      .optional()
      .isString()
      .trim(),

    query('genre')
      .optional()
      .isString()
      .trim(),

    query('year')
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() + 5 }),

    query('rating_min')
      .optional()
      .isFloat({ min: 0, max: 10 }),

    query('rating_max')
      .optional()
      .isFloat({ min: 0, max: 10 }),

    query('language')
      .optional()
      .isString()
      .trim(),

    query('sort')
      .optional()
      .isIn(['title', 'rating', 'release_year', 'created_at']),

    query('order')
      .optional()
      .isIn(['ASC', 'DESC', 'asc', 'desc']),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }),

    query('page')
      .optional()
      .isInt({ min: 1 })
  ]
};

module.exports = {
  authValidation,
  movieValidation
};