
import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <input
                ref={ref}
                className={cn(
                    "px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400",
                    "focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
                    "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
