
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/quiz', quizRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Quiz API Backend Running');
});

module.exports = app;
