const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const profileDir = path.join(__dirname, '../../uploads/profiles');
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

const movieDir = path.join(__dirname, '../../uploads/movies');
if (!fs.existsSync(movieDir)) {
  fs.mkdirSync(movieDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/profiles'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const movieStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/movies'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'movie-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|avi|mov|wmv|mkv/;

  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedImageTypes.test(file.mimetype);

  if (file.fieldname === 'trailer') {
    const videoExtname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const videoMimetype = /video/.test(file.mimetype);

    if (videoExtname && videoMimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file video yang diperbolehkan untuk trailer'));
    }
  } else {
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
  }
};

const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

const uploadMovie = multer({
  storage: movieStorage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: fileFilter
});

module.exports = {
  uploadProfile,
  uploadMovie
};