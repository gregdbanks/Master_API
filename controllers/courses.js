const Course = require('../models/Course');
const Bootcamps = require('../models/Bootcamps');
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
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// Get single courses
// GET /api/v1/courses/:id
// Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorClass(`No course with this id of : ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

// Add single courses
// POST /api/v1/bootcamps/:bootcampId/courses
// Private
exports.addSingleCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamps.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorClass(`No bootcamp with this id of : ${req.params.id}`, 404)
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// Update single courses
// PUT /api/v1/courses/:id
// Private
exports.updateSingleCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorClass(`No course with this id of : ${req.params.id}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// Update single courses
// DELETE /api/v1/courses/:id
// Private
exports.deleteSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorClass(`No course with this id of : ${req.params.id}`, 404)
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: course });
});
