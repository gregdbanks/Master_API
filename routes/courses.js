const express = require('express');
const {
  getCourses,
  getSingleCourse,
  addSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addSingleCourse);
router
  .route('/:id')
  .get(getSingleCourse)
  .put(updateSingleCourse)
  .delete(deleteSingleCourse);

module.exports = router;
