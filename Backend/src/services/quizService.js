const fetchRandomQuestions = async (supabase) => {
    // Fetch all IDs
    const { data: allIds, error: idError } = await supabase
        .from('quiz_questions')
        .select('id')
        .is('owner_id', null);

    if (idError) throw idError;

    if (!allIds || allIds.length === 0) {
        throw new Error('No questions found');
    }

    // Shuffle and pick 5
    const shuffled = allIds.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, 5).map(q => q.id);

    // Fetch details
    const { data: questions, error: qError } = await supabase
        .from('quiz_questions')
        .select('id, question_text, choices')
        .in('id', selectedIds);

    if (qError) throw qError;

    return questions;
};

const calculateAndSaveSubmission = async (supabase, userId, answers) => {
    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
        throw new Error('Must submit exactly 5 answers');
    }

    // Fetch correct answers
    const questionIds = answers.map(a => a.question_id);
    const { data: correctQuestions, error: qError } = await supabase
        .from('quiz_questions')
        .select('id, correct_choice')
        .in('id', questionIds);

    if (qError) throw qError;

    const correctMap = {};
    correctQuestions.forEach(q => {
        correctMap[q.id] = q.correct_choice;
    });

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
            correct_choice: correctChoice,
            selected_choice: ans.selected_choice
        });

        answersToInsert.push({
            question_id: ans.question_id,
            selected_choice: ans.selected_choice,
            is_correct: isCorrect,
            answered_at: new Date().toISOString()
        });
    }

    // Insert Attempt
    const { data: attempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
            user_id: userId,
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
            score: score
        })
        .select()
        .single();

    if (attemptError) throw attemptError;

    // Link answers
    const finalAnswers = answersToInsert.map(a => ({ ...a, attempt_id: attempt.id }));
    const { error: ansInsertError } = await supabase
        .from('quiz_answers')
        .insert(finalAnswers);

    if (ansInsertError) throw ansInsertError;

    return {
        score: `${score} / 5`,
        results: results,
        attemptId: attempt.id
    };
};

const fetchUserHistory = async (supabase, userId) => {
    const { data, error } = await supabase
        .from('quiz_attempts')
        .select('id, score, started_at, finished_at')
        .eq('user_id', userId)
        .order('finished_at', { ascending: false });

    if (error) throw error;
    return data;
};

const fetchAttemptDetails = async (supabase, userId, attemptId) => {
    const { data: attemptCheck, error: checkError } = await supabase
        .from('quiz_attempts')
        .select('user_id')
        .eq('id', attemptId)
        .single();

    if (checkError || !attemptCheck) throw new Error('Attempt not found');
    if (attemptCheck.user_id !== userId) throw new Error('Forbidden');

    const { data, error } = await supabase
        .from('quiz_answers')
        .select(`
            id,
            selected_choice,
            is_correct,
            question:quiz_questions (
                id,
                question_text,
                choices,
                correct_choice
            )
        `)
        .eq('attempt_id', attemptId);

    if (error) throw error;
    return data;
};

const fetchAttemptForDownload = async (supabase, userId, attemptId) => {
    const { data: attempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select('id, user_id')
        .eq('id', attemptId)
        .single();

    if (attemptError || !attempt) throw new Error('Attempt not found');
    if (attempt.user_id !== userId) throw new Error('Forbidden');

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

    return {
        attempt_id: data.id,
        score: data.score,
        date: data.finished_at,
        details: data.quiz_answers.map(ans => ({
            question: ans.question.question_text,
            your_choice: ans.question.choices[ans.selected_choice],
            correct_choice: ans.question.choices[ans.question.correct_choice],
            is_correct: ans.is_correct
        }))
    };
};

module.exports = {
    fetchRandomQuestions,
    calculateAndSaveSubmission,
    fetchUserHistory,
    fetchAttemptDetails,
    fetchAttemptForDownload
};
