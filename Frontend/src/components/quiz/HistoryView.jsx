
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';

const HistoryView = ({ onBack }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/quiz/history`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch history');

            const data = await response.json();
            setHistory(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading history...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 overflow-hidden bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-0">
            <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">My Quiz History</h2>
                    <Button onClick={onBack} variant="outline" className="text-sm px-4 py-2">
                        Back to Quiz
                    </Button>
                </div>

                <div className="overflow-y-auto flex-grow p-6 space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            No attempts yet. Take a quiz!
                        </div>
                    ) : (
                        history.map((attempt) => (
                            <div key={attempt.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div
                                    className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => toggleExpand(attempt.id)}
                                >
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {new Date(attempt.finished_at).toLocaleDateString()} at {new Date(attempt.finished_at).toLocaleTimeString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Click to view details
                                        </div>
                                    </div>
                                    <div className={`text-xl font-bold ${attempt.score >= 4 ? 'text-green-600' : attempt.score >= 3 ? 'text-brand-600' : 'text-red-600'}`}>
                                        {attempt.score} / 5
                                    </div>
                                </div>

                                {expandedId === attempt.id && (
                                    <div className="p-4 bg-white border-t border-gray-200 space-y-3">
                                        {attempt.quiz_answers.map((ans, idx) => (
                                            <div key={ans.id} className={`p-3 rounded border ${ans.is_correct ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-800">
                                                        {idx + 1}. {ans.question.question_text}
                                                    </span>
                                                    <span className={`text-sm font-bold ${ans.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                                                        {ans.is_correct ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-sm">
                                                    <span className={ans.is_correct ? 'text-green-700' : 'text-red-700'}>
                                                        Your Answer: {ans.question.choices[ans.selected_choice]}
                                                    </span>
                                                    {!ans.is_correct && (
                                                        <span className="ml-4 text-green-700">
                                                            Correct: {ans.question.choices[ans.question.correct_choice]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryView;
