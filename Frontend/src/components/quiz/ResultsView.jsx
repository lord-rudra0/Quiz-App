
import React from 'react';
import Button from '../ui/Button';
import confetti from 'canvas-confetti';


const ResultsView = ({ result, questions, onRetry, onViewHistory }) => {
    React.useEffect(() => {
        if (result.score > 60) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            const audio = new Audio('/sounds/ding.wav');
            audio.play().catch(e => console.error("Audio play failed", e));
        }
    }, [result.score]);

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 overflow-hidden bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-0">
            <div className="max-w-2xl mx-auto w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-8 border-b border-gray-100 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h2>
                    <div className="text-5xl font-extrabold text-brand-600 mb-4">{result.score}</div>
                    <p className="text-gray-600">Great job! Here is how you did:</p>
                </div>

                <div className="overflow-y-auto p-6 space-y-4 flex-grow">
                    {result.results.map((res, idx) => {
                        const q = questions.find(q => q.id === res.question_id);
                        return (
                            <div key={res.question_id} className={`p-4 rounded-lg border ${res.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-gray-900">{idx + 1}. {q?.question_text}</div>
                                    <span className={`text-sm font-bold ${res.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                                        {res.is_correct ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className={res.is_correct ? 'text-green-700' : 'text-red-700'}>
                                        <span className="font-semibold">Your Answer:</span> {q?.choices[res.selected_choice] || 'Skipped'}
                                    </div>
                                    {!res.is_correct && (
                                        <div className="text-green-700">
                                            <span className="font-semibold">Correct Answer:</span> {q?.choices[res.correct_choice]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <Button onClick={onRetry}>Take New Quiz</Button>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;
