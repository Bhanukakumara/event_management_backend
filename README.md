# Event Booking & Management Platform (Backend)

A **MERN Stack Internship Task** — Full-featured event management system with **JWT authentication**, **role-based access**, **seat locking**, **atomic MongoDB transactions**, **email simulation**, and **auto-cancellation**.

---

## Features Implemented

### 1. Authentication System
- JWT-based authentication (Access Token)
- Roles: `organizer` (manage events), `user` (book events)
- Password hashing with `bcrypt`
- Protected routes using middleware

### 2. Event Management (Organizer)
- Create, edit, delete events
- Upload event image using `Multer`
- Fields: Title, Description, Date & Time, Venue, Total Seats, Ticket Price, Image
- Auto-mark event as **'Full'** when seats are sold out
- Prevent **overlapping events** (same venue & time)

### 3. Event Booking (User)
- View upcoming events sorted by date
- Filter by date, venue, price range
- Book seats with **atomic MongoDB operations**
- **Lock seats during booking** until payment
- **Simulated confirmation email** via `Nodemailer`
- **Auto-cancel unpaid bookings after 5 minutes**

### 4. Smart Logic
- Atomic seat updates using **MongoDB Transactions** (Replica Set)
- Prevent **race conditions & overbooking**
- Auto-mark events as **'Completed'** after event date passes

### 5. Backend Architecture
- Clean folder structure: `models/`, `controllers/`, `routes/`, `middleware/`, `utils/`
- Centralized error handling
- `.env` configuration
- Image storage in `/uploads`

---

## Tech Stack

| Layer        | Technology                  |
|------------|---------------------------|
| Runtime     | Node.js                   |
| Framework   | Express.js                |
| Database    | MongoDB (Atlas / Local Replica Set) |
| Auth        | JWT + bcrypt              |
| File Upload | Multer                    |
| Email       | Nodemailer (Gmail)        |
| Dev Tools   | nodemon, dotenv           |

---

## Project Structure
