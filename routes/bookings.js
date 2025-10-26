const express = require('express');
const { bookSeats } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, bookSeats);

module.exports = router;