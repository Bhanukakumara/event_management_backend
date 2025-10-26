const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendEmail } = require('../utils/sendEmail');

// Book Seats
const bookSeats = async (req, res) => {
  const { eventId, seats } = req.body;

  const event = await Event.findById(eventId);
  if (!event || event.status !== 'upcoming') return res.status(400).json({ msg: 'Event not available' });
  if (event.availableSeats < seats) return res.status(400).json({ msg: 'Not enough seats' });

  // Atomic update to lock seats
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: seats } },
      { $inc: { availableSeats: -seats } },
      { new: true, session }
    );

    if (!updatedEvent) {
      throw new Error('Seats taken by someone else');
    }

    if (updatedEvent.availableSeats === 0) {
      await Event.findByIdAndUpdate(eventId, { status: 'full' }, { session });
    }

    const booking = await Booking.create([{
      event: eventId,
      user: req.user._id,
      seats,
      totalPrice: seats * event.ticketPrice,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }], { session });

    await session.commitTransaction();

    // Simulate email
    await sendEmail({
      to: req.user.email,
      subject: 'Booking Confirmation',
      text: `You have booked ${seats} seat(s) for ${event.title}. Pay within 5 mins!`,
    });

    // Auto-cancel after 5 mins
    setTimeout(async () => {
      const b = await Booking.findById(booking[0]._id);
      if (b && b.status === 'pending') {
        await Booking.findByIdAndUpdate(b._id, { status: 'cancelled' });
        await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: seats } });
      }
    }, 5 * 60 * 1000);

    res.json(booking[0]);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ msg: err.message });
  } finally {
    session.endSession();
  }
};

module.exports = { bookSeats };