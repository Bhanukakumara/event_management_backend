const express = require('express');
const { createEvent, getEvents } = require('../controllers/eventController');
const { protect, organizer } = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', protect, organizer, upload.single('image'), createEvent);
router.get('/', getEvents);

module.exports = router;