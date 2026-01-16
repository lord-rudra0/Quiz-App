
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



app.get('/', (req, res) => {
    res.send('Quiz App Backend is running');
});

// Deployment Probe
app.get('/api/version', (req, res) => {
    res.json({ version: '1.0.1', features: ['download'] });
});

module.exports = app;
