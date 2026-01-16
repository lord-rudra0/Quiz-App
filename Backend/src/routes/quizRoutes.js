const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Routes
router.get('/', quizController.getQuizQuestions);
router.post('/submit', quizController.submitQuiz);
router.get('/history', quizController.getHistory);
router.get('/history/:attemptId', quizController.getAttemptDetails);
router.get('/download/:attemptId', quizController.downloadAttempt);

module.exports = router;
