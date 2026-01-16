
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedChoiceIndex }

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

            const response = await fetch('http://localhost:5000/api/quiz', {
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

    const [result, setResult] = useState(null);

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
                question_id: parseInt(qId),
                selected_choice: choiceIdx
            }));

            // Validate exactly 5 answers
            if (formattedAnswers.length !== 5) {
                // If implied 5 questions, fill missing with -1 or handle error
                // For this demo, let's assume user answered all (UI forces it?)
                // Actually my Next button checks `answers[currentQuestion.id] === undefined`, 
                // but user could skip if logic wasn't tight. 
                // Let's just send what we have, backend validates count.
            }

            const response = await fetch('http://localhost:5000/api/quiz/submit', {
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

    if (loading) return (
        <div className="fixed top-16 left-0 right-0 bottom-0 flex items-center justify-center bg-brand-50 z-0">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
    );

    if (result) return (
        <div className="fixed top-16 left-0 right-0 bottom-0 overflow-hidden bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-0">
            <div className="max-w-2xl mx-auto w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-8 border-b border-gray-100 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h2>
                    <div className="text-5xl font-extrabold text-brand-600 mb-4">{result.score}</div>
                    <p className="text-gray-600">Great job! Here is how you did:</p>
                </div>

                <div className="overflow-y-auto p-6 space-y-4 flex-grow">
                    {result.results.map((res, idx) => {
                        // Find original question text (simple lookup since order might vary or we use ID)
                        // Actually result only sends { question_id, is_correct }. 
                        // We have `questions` state locally.
                        const q = questions.find(q => q.id === res.question_id);
                        return (
                            <div key={res.question_id} className={`p-4 rounded-lg border ${res.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="font-medium text-gray-900">{idx + 1}. {q?.question_text}</div>
                                    <span className={`text-sm font-bold ${res.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                                        {res.is_correct ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <Button onClick={() => window.location.reload()}>Take New Quiz</Button>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Quiz</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={fetchQuiz}>Try Again</Button>
            </div>
        </div>
    );

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 overflow-hidden bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-0">
            <div className="max-w-3xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {user?.user_metadata?.full_name || 'Quizzer'}!
                        </h1>
                        <p className="mt-2 text-gray-600">General Knowledge Quiz</p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-medium text-brand-600 bg-brand-100 px-3 py-1 rounded-full">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                    <div
                        className="bg-brand-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-8">
                        <h3 className="text-xl font-medium text-gray-900 mb-6">
                            {currentQuestion.question_text}
                        </h3>

                        <div className="space-y-3">
                            {currentQuestion.choices ? (
                                currentQuestion.choices.map((choice, i) => {
                                    const isSelected = answers[currentQuestion.id] === i;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleAnswerSelect(currentQuestion.id, i)}
                                            className={`p-4 border rounded-lg transition-all cursor-pointer flex items-center ${isSelected
                                                ? 'border-brand-500 bg-brand-50 shadow-sm'
                                                : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-gray-400'
                                                }`}>
                                                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <span className={`font-medium ${isSelected ? 'text-brand-900' : 'text-gray-700'}`}>
                                                {choice}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-red-500 text-sm">No choices available</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleNext}
                        disabled={answers[currentQuestion.id] === undefined}
                        className="px-8 py-3 text-lg"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
