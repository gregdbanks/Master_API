const path = require('path');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamps');
const ErrorClass = require('../utils/errorClass');
const asyncHandler = require('../middleware/async');
const Bootcamps = require('../models/Bootcamps');

// Get All bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
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
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorClass(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

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
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorClass(
        `Bootcamp with id of ${req.params.id} not found homie`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorClass(`User ${req.params.id} cant update this bootcamp`, 401)
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, reb.body, {
    new: true,
    renValidators: true,
  });

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// Delete Bootcamp
// DELETE /api/v1/bootcamp/:id
// Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorClass(
        `Bootcamp with id of ${req.params.id} not found homie`,
        404
      )
    );
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorClass(`User ${req.params.id} cant delete this bootcamp`, 401)
    );
  }

  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// Get bootcamps within a given radius
// GET /api/v1/bootcamps/radius/:zipcode/:distance
//
exports.getBootcampsRange = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius ... distance/radius of earth(3,663 miles)
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// Upload Photo
// PUT /api/v1/bootcamp/:id/photo
// Private
exports.bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorClass(
        `Bootcamp with id of ${req.params.id} not found homie`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorClass(`User ${req.params.id} cant update this bootcamp`, 401)
    );
  }

  if (!req.files) {
    return next(new ErrorClass(`Please Upload a File`, 400));
  }

  const file = req.files.file;

  // Make sure image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorClass(`Please Upload a valid photo`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorClass(
        `Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Upload to public
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorClass(`Problem with file upload`, 500));
    }

    await Bootcamps.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
