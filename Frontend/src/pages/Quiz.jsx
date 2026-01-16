
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import LoadingState from '../components/quiz/LoadingState';
import ErrorState from '../components/quiz/ErrorState';
import ResultsView from '../components/quiz/ResultsView';
import HistoryView from '../components/quiz/HistoryView';
import QuestionCard from '../components/quiz/QuestionCard';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedChoiceIndex }
    const [result, setResult] = useState(null);
    const [view, setView] = useState('quiz'); // 'quiz' | 'history'

    useEffect(() => {
        fetchQuiz();
        getUserDetails();
    }, []);

    const getUserDetails = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const fetchQuiz = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setError('Please log in to take the quiz.');
                setLoading(false);
                return;
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/quiz`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error('Unauthorized');
                if (response.status === 403) throw new Error('Forbidden');
                throw new Error('Failed to fetch quiz');
            }

            const data = await response.json();
            setQuestions(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, choiceIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: choiceIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            // Format answers for API
            const formattedAnswers = Object.entries(answers).map(([qId, choiceIdx]) => ({
                question_id: qId,
                selected_choice: choiceIdx
            }));

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answers: formattedAnswers })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to submit quiz');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingState />;

    if (error) return <ErrorState error={error} onRetry={fetchQuiz} />;

    if (view === 'history') {
        return <HistoryView onBack={() => setView('quiz')} />;
    }

    if (result) return (
        <ResultsView
            result={result}
            questions={questions}
            onRetry={() => window.location.reload()}
            onViewHistory={() => setView('history')}
        />
    );

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
        <QuestionCard
            question={currentQuestion}
            index={currentQuestionIndex}
            totalQuestions={questions.length}
            answers={answers}
            user={user}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onViewHistory={() => setView('history')}
        />
    );
};

export default Quiz;
