const express = require('express');
const router = express.Router();
const { getBootcamps } = require('../controllers/bootcamps');

router.route('/').get(getBootcamps);

router.get('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: 'hey howdy you ' + req.params.id });
});

router.post('/', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: 'hey howdy new all ' + req.params.id });
});

module.exports = router;
