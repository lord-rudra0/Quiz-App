const { createAuthClient } = require('../utils/supabaseHelper');
const quizService = require('../services/quizService');

// 1. Fetch 5 random questions
const getQuizQuestions = async (req, res) => {
    try {
        const supabase = createAuthClient(req);
        const questions = await quizService.fetchRandomQuestions(supabase);
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// 2. Submit answers
const submitQuiz = async (req, res) => {
    try {
        const supabase = createAuthClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const result = await quizService.calculateAndSaveSubmission(supabase, user.id, req.body.answers);
        res.json(result);
    } catch (error) {
        console.error('Error submitting quiz:', error);
        // Safely handle specific errors if needed
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// 3. Fetch history summary
const getHistory = async (req, res) => {
    try {
        const supabase = createAuthClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const history = await quizService.fetchUserHistory(supabase, user.id);
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// 4. Fetch attempt details
const getAttemptDetails = async (req, res) => {
    try {
        const supabase = createAuthClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const details = await quizService.fetchAttemptDetails(supabase, user.id, req.params.attemptId);
        res.json(details);
    } catch (error) {
        console.error('Error fetching attempt details:', error);
        const status = error.message === 'Forbidden' ? 403 : error.message === 'Attempt not found' ? 404 : 500;
        res.status(status).json({ error: error.message || 'Internal server error' });
    }
};



// 6. Download attempt
const downloadAttempt = async (req, res) => {
    try {
        const supabase = createAuthClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const exportData = await quizService.fetchAttemptForDownload(supabase, user.id, req.params.attemptId);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=attempt-${exportData.attempt_id}.json`);
        res.json(exportData);
    } catch (error) {
        console.error('Error downloading attempt:', error);
        const status = error.message === 'Forbidden' ? 403 : error.message === 'Attempt not found' ? 404 : 500;
        res.status(status).json({ error: error.message || 'Internal server error' });
    }
};

module.exports = {
    getQuizQuestions,
    submitQuiz,
    getHistory,
    getAttemptDetails,
    downloadAttempt
};
