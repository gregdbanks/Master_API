const Bootcamp = require('../models/Bootcamps');
const ErrorClass = require('../utils/errorClass');

// Get All bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  try {
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    next(err);
  }
};

// Get Single Bootcamp
// GET /api/v1/bootcamps/:id
// Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    console.log(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorClass(
          `Bootcamp with id of ${req.params.id} not found homie`,
          404
        )
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};

// Create New Bootcamp
// POST /api/v1/bootcamps/
// Private
exports.createBootcamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  try {
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(err);
  }
};

// Update Bootcamp
// PUT /api/v1/bootcamp/:id
// Private
exports.updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(err);
  }
};

// Delete Bootcamp
// DELETE /api/v1/bootcamp/:id
// Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};
