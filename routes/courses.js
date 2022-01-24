const express = require('express');
const {
  getCourses,
  getSingleCourse,
  addSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
} = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addSingleCourse);
router
  .route('/:id')
  .get(getSingleCourse)
  .put(protect, authorize('publisher', 'admin'), updateSingleCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteSingleCourse);

module.exports = router;
