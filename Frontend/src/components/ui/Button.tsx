import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes safely
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', magnetic = false, children, onClick, ...props }, ref) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const [rippleStyle, setRippleStyle] = useState<React.CSSProperties>({});
        const [isRippling, setIsRippling] = useState(false);

        // Magnetic effect state
        const [position, setPosition] = useState({ x: 0, y: 0 });

        const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!magnetic || !buttonRef.current) return;
            const { clientX, clientY } = e;
            const { width, height, left, top } = buttonRef.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            setPosition({ x: x * 0.2, y: y * 0.2 });
        };

        const handleMouseLeave = () => {
            if (!magnetic) return;
            setPosition({ x: 0, y: 0 });
        };

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            // Ripple effect
            const rect = e.currentTarget.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            setRippleStyle({
                width: size,
                height: size,
                top: y,
                left: x,
            });
            setIsRippling(true);
            setTimeout(() => setIsRippling(false), 600);

            if (onClick) onClick(e);
        };

        const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-colors overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
            secondary: 'bg-accent-600 text-white hover:bg-accent-700 shadow-sm',
            outline: 'border-2 border-slate-200 text-slate-800 hover:border-primary-600 hover:text-primary-600',
            ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <motion.button
                ref={(node) => {
                    buttonRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children as any}
                </span>

                {/* Ripple */}
                {isRippling && (
                    <span
                        className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                        style={rippleStyle}
                    />
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
