const Bootcamp = require('../models/Bootcamps');
const ErrorClass = require('../utils/errorClass');
const asyncHandler = require('../middleware/async');

// Get All bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// Get Single Bootcamp
// GET /api/v1/bootcamps/:id
// Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorClass(
        `Bootcamp with id of ${req.params.id} not found homie`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// Create New Bootcamp
// POST /api/v1/bootcamps/
// Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// Update Bootcamp
// PUT /api/v1/bootcamp/:id
// Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorClass(
        `Bootcamp with id of ${req.params.id} not found homie`,
        404
      )
    );
  }
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// Delete Bootcamp
// DELETE /api/v1/bootcamp/:id
// Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorClass(
        `Bootcamp with id of ${req.params.id} not found homie`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: {} });
});
