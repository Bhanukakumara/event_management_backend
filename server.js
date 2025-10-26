const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Auto mark past events as completed
setInterval(async () => {
  await Event.updateMany(
    { date: { $lt: new Date() }, status: 'upcoming' },
    { status: 'completed' }
  );
}, 60 * 60 * 1000); // every hour