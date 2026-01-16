
import React from 'react';

const LoadingState = () => {
    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 flex items-center justify-center bg-brand-50 z-0">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
    );
};

export default LoadingState;
