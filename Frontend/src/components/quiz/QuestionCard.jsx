
import React from 'react';
import Button from '../ui/Button';

const QuestionCard = ({
    question,
    index,
    totalQuestions,
    answers,
    user,
    onAnswerSelect,
    onNext,
    onTimeout,
    onViewHistory
}) => {
    // 0-based index for display logic
    const isAnswered = answers[question.id] !== undefined;
    const isLastQuestion = index === totalQuestions - 1;
    const [timeLeft, setTimeLeft] = React.useState(30);

    React.useEffect(() => {
        setTimeLeft(30);
    }, [question.id]);

    React.useEffect(() => {
        if (isAnswered) return; // Stop timer if already answered

        if (timeLeft <= 0) {
            onTimeout();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isAnswered, onTimeout]);

    const getTimerColor = () => {
        if (timeLeft > 10) return 'text-brand-600 bg-brand-100';
        if (timeLeft > 5) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100 animate-pulse';
    };

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-start z-0">
            <div className="max-w-3xl mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {user?.user_metadata?.full_name || 'Quizzer'}!
                        </h1>
                        <p className="mt-2 text-gray-600">General Knowledge Quiz</p>
                    </div>
                    <div className="text-right flex flex-col gap-2 items-end">
                        <span className="text-sm font-medium text-brand-600 bg-brand-100 px-3 py-1 rounded-full">
                            Question {index + 1} of {totalQuestions}
                        </span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold transition-colors ${getTimerColor()}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {timeLeft}s
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                    <div
                        className="bg-brand-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${((index + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-8">
                        <h3 className="text-xl font-medium text-gray-900 mb-6">
                            {question.question_text}
                        </h3>

                        <div className="space-y-3">
                            {question.choices ? (
                                question.choices.map((choice, i) => {
                                    const isSelected = answers[question.id] === i;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => onAnswerSelect(question.id, i)}
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
                        onClick={onNext}
                        disabled={!isAnswered}
                        className="px-8 py-3 text-lg"
                    >
                        {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                </div>
            </div>
            {/* Mobile Footer Spacer */}
            <div className="h-20 w-full md:hidden flex-shrink-0"></div>
        </div>
    );
};

export default QuestionCard;
