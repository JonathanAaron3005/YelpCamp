const express = require('express');
const router = express.Router();
const wrap = require('../utilities/wrap');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const { storage } = require('../cloudinary');
const multer = require('multer'); //digunakan utk render multipart form (form yg bisa upload file)
const upload = multer({ storage });


router.route('/')
    .get(wrap(campgrounds.showAllCampgrounds))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrap(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(wrap(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrap(campgrounds.updateCampground))
    .delete(isAuthor, wrap(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, wrap(campgrounds.renderUpdateForm));

module.exports = router;