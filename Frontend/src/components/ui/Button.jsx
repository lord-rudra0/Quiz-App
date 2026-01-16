
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils'; // We'll create utils later or inline it

const Button = ({ className, isLoading, children, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "w-full px-4 py-2 bg-brand-600 text-white rounded-lg font-medium shadow-md hover:bg-brand-700 transition-colors focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                </span>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default Button;
