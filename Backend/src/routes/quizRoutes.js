
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

const { createClient } = require('@supabase/supabase-js');

// 1. GET / - Fetch 5 random questions
router.get('/', async (req, res) => {
    try {
        // Create an authenticated client for this request to respect RLS
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: req.headers.authorization,
                    },
                },
            }
        );

        // Strategy: Fetch all IDs, pick 5 random, then fetch details
        // Note: This is fine for a small/medium number of questions.
        const { data: allIds, error: idError } = await supabase
            .from('quiz_questions')
            .select('id')
            .is('owner_id', null); // Global questions only

        if (idError) throw idError;

        if (!allIds || allIds.length === 0) {
            console.log('Query returned 0 rows. RLS or Filter issue?');
            return res.status(404).json({ error: 'No questions found' });
        }

        // Shuffle and pick 5
        const shuffled = allIds.sort(() => 0.5 - Math.random());
        const selectedIds = shuffled.slice(0, 5).map(q => q.id);

        // Fetch details for selected questions
        const { data: questions, error: qError } = await supabase
            .from('quiz_questions')
            .select('id, question_text, choices') // Explicitly exclude correct_choice
            .in('id', selectedIds);

        if (qError) throw qError;

        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. POST /submit - Submit answers
router.post('/submit', async (req, res) => {
    try {
        const { answers } = req.body;
        // content of answers: [{ question_id, selected_choice }]

        // Create an authenticated client for this request to respect RLS
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: req.headers.authorization,
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const userId = user.id;

        if (!answers || !Array.isArray(answers) || answers.length !== 5) {
            return res.status(400).json({ error: 'Must submit exactly 5 answers' });
        }

        // specific validation could go here (e.g. check for duplicates)

        // Fetch correct answers for these questions
        const questionIds = answers.map(a => a.question_id);
        const { data: correctQuestions, error: qError } = await supabase
            .from('quiz_questions')
            .select('id, correct_choice')
            .in('id', questionIds);

        if (qError) throw qError;

        // Create a map for easy lookup
        const correctMap = {};
        correctQuestions.forEach(q => {
            correctMap[q.id] = q.correct_choice;
        });

        // Calculate score
        let score = 0;
        const answersToInsert = [];
        const results = [];

        for (const ans of answers) {
            const correctChoice = correctMap[ans.question_id];
            const isCorrect = (ans.selected_choice === correctChoice);

            if (isCorrect) score++;

            results.push({
                question_id: ans.question_id,
                is_correct: isCorrect,
                correct_choice: correctChoice // Send back index so frontend can show "Correct Answer: X"
            });

            answersToInsert.push({
                question_id: ans.question_id,
                selected_choice: ans.selected_choice,
                is_correct: isCorrect,
                answered_at: new Date().toISOString()
                // attempt_id will be added after creating attempt
            });
        }

        // Insert Attempt
        const { data: attempt, error: attemptError } = await supabase
            .from('quiz_attempts')
            .insert({
                user_id: userId,
                started_at: new Date().toISOString(), // Assuming started now for simplicity, or could receive from client
                finished_at: new Date().toISOString(),
                score: score
            })
            .select()
            .single();

        if (attemptError) throw attemptError;

        // Link answers to attempt
        const finalAnswers = answersToInsert.map(a => ({ ...a, attempt_id: attempt.id }));
        const { error: ansInsertError } = await supabase
            .from('quiz_answers')
            .insert(finalAnswers);

        if (ansInsertError) throw ansInsertError;

        console.log('Submission Results:', JSON.stringify(results, null, 2));

        res.json({
            score: `${score} / 5`,
            results: results,
            attemptId: attempt.id
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. GET /results - History
router.get('/results', async (req, res) => {
    try {
        const userId = req.user.id;

        // Query attempts with related answers and nested questions
        // Note: Supabase structure: quiz_attempts -> quiz_answers -> quiz_questions
        const { data, error } = await supabase
            .from('quiz_attempts')
            .select(`
        id,
        score,
        started_at,
        finished_at,
        quiz_answers (
          id,
          selected_choice,
          is_correct,
          question:quiz_questions (
             id,
             question_text,
             choices,
             correct_choice
          )
        )
      `)
            .eq('user_id', userId)
            .order('finished_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. GET /download/:attemptId
router.get('/download/:attemptId', async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userId = req.user.id;

        // Verify ownership
        const { data: attempt, error: attemptError } = await supabase
            .from('quiz_attempts')
            .select('id, user_id')
            .eq('id', attemptId)
            .single();

        if (attemptError || !attempt) {
            return res.status(404).json({ error: 'Attempt not found' });
        }

        if (attempt.user_id !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Fetch full data
        const { data, error } = await supabase
            .from('quiz_attempts')
            .select(`
        id,
        score,
        started_at,
        finished_at,
        quiz_answers (
          selected_choice,
          is_correct,
          question:quiz_questions (
             question_text,
             choices,
             correct_choice
          )
        )
      `)
            .eq('id', attemptId)
            .single();

        if (error) throw error;

        // Format for download
        const exportData = {
            attempt_id: data.id,
            score: data.score,
            date: data.finished_at,
            details: data.quiz_answers.map(ans => ({
                question: ans.question.question_text,
                your_choice: ans.question.choices[ans.selected_choice], // Assuming choices is array and index used
                correct_choice: ans.question.choices[ans.question.correct_choice],
                is_correct: ans.is_correct
            }))
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=attempt-${attemptId}.json`);
        res.json(exportData);

    } catch (error) {
        console.error('Error downloading attempt:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
