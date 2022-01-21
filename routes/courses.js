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

router
  .route('/')
  .get(
    advanceResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(addSingleCourse);
router
  .route('/:id')
  .get(getSingleCourse)
  .put(updateSingleCourse)
  .delete(deleteSingleCourse);

module.exports = router;
