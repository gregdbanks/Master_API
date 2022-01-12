// Get All bootcamps
// GET /api/v1/bootcamps
// Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'hey howdy all' });
};
