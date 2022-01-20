const Course = require('../models/Course');
const ErrorClass = require('../utils/errorClass');
const asyncHandler = require('../middleware/async');

// Get All courses
// GET /api/v1/courses
// GET /api/v1/bootcamps/:bootcampId/courses
// Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
