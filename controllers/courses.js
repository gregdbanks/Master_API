const Course = require('../models/Course');
const Bootcamps = require('../models/Bootcamps');
const ErrorClass = require('../utils/errorClass');
const asyncHandler = require('../middleware/async');

// Get All courses
// GET /api/v1/courses
// GET /api/v1/bootcamps/:bootcampId/courses
// Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    return res.status(200).json(res.advanceResults);
  }
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
  req.body.user = req.user.id;

  const bootcamp = await Bootcamps.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorClass(`No bootcamp with this id of : ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorClass(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp.id}`,
        401
      )
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

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorClass(
        `User ${req.user.id} is not authorized to update course to bootcamp `,
        401
      )
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
      new ErrorClass(`No course with this id of : ${req.params._id}`, 404)
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorClass(
        `User ${req.user.id} is not authorized to delete course to bootcamp `,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: course });
});
