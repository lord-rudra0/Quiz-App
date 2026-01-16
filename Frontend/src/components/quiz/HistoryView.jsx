
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';

const HistoryView = ({ onBack }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [detailsCache, setDetailsCache] = useState({}); // { attemptId: answers[] }
    const [loadingDetails, setLoadingDetails] = useState({}); // { attemptId: boolean }
    const [downloadingIds, setDownloadingIds] = useState({}); // { attemptId: boolean }

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

    const toggleExpand = async (id) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        setExpandedId(id);

        // If details not cached, fetch them
        if (!detailsCache[id]) {
            setLoadingDetails(prev => ({ ...prev, [id]: true }));
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                const response = await fetch(`${API_URL}/api/quiz/history/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch details');

                const data = await response.json();
                setDetailsCache(prev => ({ ...prev, [id]: data }));
            } catch (err) {
                console.error(err);
                // Optionally handle specific error for this item
            } finally {
                setLoadingDetails(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    const handleDownload = async (id, e) => {
        e.stopPropagation(); // Prevent toggling expand
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/quiz/download/${id}`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quiz-result-${id.slice(0, 8)}.json`; // Shorter name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download error:', err);
            alert('Failed to download results.');
        }
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
                                            {expandedId === attempt.id ? 'Click to collapse' : 'Click to view details'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={(e) => handleDownload(attempt.id, e)}
                                            disabled={downloadingIds[attempt.id]}
                                            className="p-1.5 bg-white border-brand-200 hover:bg-brand-50 text-brand-700 aspect-square flex items-center justify-center rounded-md disabled:opacity-50"
                                            title="Download Results"
                                        >
                                            {downloadingIds[attempt.id] ? (
                                                <svg className="animate-spin h-4 w-4 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                            )}
                                        </Button>
                                        <div className={`text-xl font-bold whitespace-nowrap ${attempt.score >= 4 ? 'text-green-600' : attempt.score >= 3 ? 'text-brand-600' : 'text-red-600'}`}>
                                            {attempt.score} / 5
                                        </div>
                                    </div>
                                </div>

                                {expandedId === attempt.id && (
                                    <div className="p-4 bg-white border-t border-gray-200 space-y-3">
                                        {loadingDetails[attempt.id] ? (
                                            <div className="flex justify-center p-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                                            </div>
                                        ) : detailsCache[attempt.id] ? (
                                            detailsCache[attempt.id].map((ans, idx) => (
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
                                            ))
                                        ) : (
                                            <div className="text-center text-red-500">Failed to load details</div>
                                        )}
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
