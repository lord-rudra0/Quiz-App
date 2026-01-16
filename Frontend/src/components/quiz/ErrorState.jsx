
import React from 'react';
import Button from '../ui/Button';

const ErrorState = ({ error, onRetry }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Quiz</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={onRetry}>Try Again</Button>
            </div>
        </div>
    );
};

export default ErrorState;
