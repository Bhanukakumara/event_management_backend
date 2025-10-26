const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Create Event (Organizer)
const createEvent = async (req, res) => {
  const { title, description, date, venue, totalSeats, ticketPrice } = req.body;
  const image = req.file ? req.file.path : null;

  // Check overlapping events
  const overlapping = await Event.findOne({
    venue,
    date: { $gte: new Date(date) - 2 * 60 * 60 * 1000, $lte: new Date(date) + 2 * 60 * 60 * 1000 },
    _id: { $ne: req.params.id || null },
  });
  if (overlapping) return res.status(400).json({ msg: 'Venue not available at this time' });

  const event = await Event.create({
    ...req.body,
    totalSeats: +totalSeats,
    availableSeats: +totalSeats,
    ticketPrice: +ticketPrice,
    image,
    organizer: req.user._id,
  });

  res.status(201).json(event);
};

// Get All Events (Public)
const getEvents = async (req, res) => {
  const { date, venue, minPrice, maxPrice } = req.query;
  let query = { status: 'upcoming' };

  if (date) query.date = { $gte: new Date(date) };
  if (venue) query.venue = new RegExp(venue, 'i');
  if (minPrice || maxPrice) {
    query.ticketPrice = {};
    if (minPrice) query.ticketPrice.$gte = +minPrice;
    if (maxPrice) query.ticketPrice.$lte = +maxPrice;
  }

  const events = await Event.find(query).sort({ date: 1 });
  res.json(events);
};

const organizerDashboard = async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });
  const bookings = await Booking.find({ event: { $in: events.map(e => e._id) }, status: 'confirmed' });

  const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const ticketsSold = bookings.reduce((sum, b) => sum + b.seats, 0);

  res.json({ events, revenue, ticketsSold });
};

module.exports = { createEvent, getEvents };