const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const habitRoutes = require('./routes/habits');

// Load environment variables first
dotenv.config();

// Initialize express
const app = express();

// Middleware to allow cros s-origin requests from your frontend (localhost:3000)
app.use(cors({ // Local and live frontend URLs
  credentials: true, // Enable cookies or auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // HTTP methods allowed
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], // Extend as needed
}));

app.use(express.json()); // Parse JSON requests

// Database connection
mongoose.connect('mongodb://localhost:27017/HabitTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.use("/api/habits", habitRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Habit Tracker Backend!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
