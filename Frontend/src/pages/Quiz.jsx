
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
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

    return (
        <div className="min-h-screen bg-brand-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {user?.user_metadata?.full_name || 'Quizzer'}!
                        </h1>
                        <p className="mt-2 text-gray-600">General Knowledge Quiz</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    <span className="text-brand-600 font-bold mr-2">Q{index + 1}.</span>
                                    {q.question_text}
                                </h3>

                                <div className="space-y-3">
                                    {q.choices ? (
                                        q.choices.map((choice, i) => (
                                            <div
                                                key={i}
                                                className="p-3 border border-gray-200 rounded-md hover:bg-brand-50 hover:border-brand-200 transition-colors cursor-pointer"
                                            >
                                                <span className="font-medium text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                                                {choice}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-red-500 text-sm">No choices available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {questions.length > 0 && (
                    <div className="mt-8 flex justify-end">
                        <Button className="px-8" disabled>Submitting Disabled (Preview)</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
