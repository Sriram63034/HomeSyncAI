import { motion } from 'framer-motion';

interface AIScoreRingProps {
    score: number; // 0-100
    size?: number;
}

export const AIScoreRing = ({ score, size = 64 }: AIScoreRingProps) => {
    const strokeWidth = size * 0.1;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let colorClass = 'text-green-500';
    if (score < 50) colorClass = 'text-red-500';
    else if (score < 80) colorClass = 'text-yellow-500';

    return (
        <div className="relative inline-flex items-center justify-center group" style={{ width: size, height: size }}>
            {/* Background Ring */}
            <svg className="absolute top-0 flex items-center justify-center -rotate-90 pointer-events-none" width={size} height={size}>
                <circle
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Animated Score Ring */}
                <motion.circle
                    className={colorClass}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
            </svg>
            {/* Score Text */}
            <span className="absolute font-bold text-slate-900 dark:text-white" style={{ fontSize: size * 0.3 }}>
                {score}
            </span>
            {/* Glow */}
            <div
                className={`absolute inset-0 rounded-full blur-md opacity-30 ${colorClass.replace('text-', 'bg-')}`}
            />

            {/* Tooltip on Hover */}
            <div className="absolute top-full mt-2 w-48 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 scale-95 origin-top group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-50">
                <h4 className="font-semibold mb-2">AI Match Breakdown</h4>
                <div className="space-y-1">
                    <div className="flex justify-between"><span>Budget</span><span>{Math.min(100, score + 10)}%</span></div>
                    <div className="flex justify-between"><span>Location</span><span>{Math.min(100, score + 5)}%</span></div>
                    <div className="flex justify-between"><span>Amenities</span><span>{score}%</span></div>
                </div>
            </div>
        </div>
    );
};
