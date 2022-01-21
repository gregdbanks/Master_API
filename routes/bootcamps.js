const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsRange,
  bootcampUploadPhoto,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamps');
const advanceResults = require('../middleware/advanceResults');

// Include other resource routers
const courseRouter = require('./courses');
const Bootcamps = require('../models/Bootcamps');

const router = express.Router();

//Re-ROute into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsRange);

router.route('/:id/photo').put(bootcampUploadPhoto);

router
  .route('/')
  .get(advanceResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
