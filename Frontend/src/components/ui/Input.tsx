import React, { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from './Button';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, id, error, success, type = 'text', ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
        const [, setIsFocused] = useState(false);

        return (
            <div className="relative w-full mb-6">
                <div className="relative">
                    <input
                        {...props}
                        id={inputId}
                        ref={ref}
                        type={type}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        className={cn(
                            'peer w-full h-14 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border rounded-xl px-4 pt-4 pb-1 text-slate-900 dark:text-white',
                            'transition-all duration-300 outline-none focus:ring-2 focus:border-transparent',
                            error
                                ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/20'
                                : success
                                    ? 'border-green-300 dark:border-green-500/50 focus:ring-green-500/20 bg-green-50/50 dark:bg-green-900/20'
                                    : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-slate-800',
                            className
                        )}
                        placeholder=" " // Important for peer-placeholder-shown to work
                    />

                    <label
                        htmlFor={inputId}
                        className={cn(
                            'absolute left-4 cursor-text transition-all duration-300 transform',
                            'text-slate-500 dark:text-slate-400',
                            'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base',
                            'peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600 dark:peer-focus:text-primary-400',
                            'top-2 text-xs', // Default state when input has value
                            error && 'peer-focus:text-red-600 text-red-500',
                            success && 'peer-focus:text-green-600 text-green-500'
                        )}
                    >
                        {label}
                    </label>

                    {/* Validation Icons */}
                    <div className="absolute right-4 top-4 pointer-events-none">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                >
                                    <X size={20} className="text-red-500" />
                                </motion.div>
                            )}
                            {success && !error && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                >
                                    <Check size={20} className="text-green-500" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="flex items-center gap-1 text-sm text-red-500 mt-1.5 ml-1">
                                <AlertCircle size={14} />
                                {error}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = 'Input';
