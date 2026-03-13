import { motion } from 'framer-motion';
import { cn } from './Button';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    variant?: 'primary' | 'white';
}

export const Spinner = ({ size = 'md', className, variant = 'primary' }: SpinnerProps) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const variants = {
        primary: 'text-primary-600 border-primary-200 border-t-primary-600',
        white: 'text-white border-white/30 border-t-white'
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className={cn(
                'rounded-full border-2',
                sizes[size],
                variants[variant],
                className
            )}
        />
    );
};

export const Skeleton = ({ className }: { className?: string }) => {
    return (
        <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={cn("bg-slate-200 rounded-xl", className)}
        />
    );
};

export const LoadingDots = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex space-x-1.5", className)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary-500 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};
