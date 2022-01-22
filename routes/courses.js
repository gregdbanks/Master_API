const express = require('express');
const {
  getCourses,
  getSingleCourse,
  addSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
} = require('../controllers/courses');

const Course = require('../models/Course');
const advanceResults = require('../middleware/advanceResults');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(
    advanceResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, addSingleCourse);
router
  .route('/:id')
  .get(getSingleCourse)
  .put(protect, updateSingleCourse)
  .delete(protect, deleteSingleCourse);

module.exports = router;
