import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Mail, Check, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/Button';

// SVG Icons for platforms not in lucide-react by default
const TwitterIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

interface SharePropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: {
        title: string;
        image_url?: string;
    };
}

export const SharePropertyModal: React.FC<SharePropertyModalProps> = ({ isOpen, onClose, property }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = window.location.href;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property.title} - ${shareUrl}`)}`, '_blank');
    };

    const handleTelegram = () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(property.title)}`, '_blank');
    };

    const handleEmail = () => {
        window.open(`mailto:?subject=${encodeURIComponent(`Check out this property: ${property.title}`)}&body=${encodeURIComponent(`I found this great property and wanted to share it with you: ${shareUrl}`)}`, '_self');
    };

    const handleTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this amazing property: ${property.title}`)}`, '_blank');
    };

    const defaultImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-100 dark:border-slate-800 relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-sm text-slate-700 hover:text-slate-900 hover:bg-white rounded-full transition-colors z-10 shadow-sm"
                            >
                                <X size={20} />
                            </button>

                            {/* Property Preview */}
                            <div className="relative h-48 w-full bg-slate-200">
                                <img
                                    src={property.image_url || defaultImage}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-5">
                                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                                        {property.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Share Actions */}
                            <div className="p-6">
                                <h4 className="text-center font-bold text-slate-900 dark:text-white mb-6 text-xl">Share this home</h4>

                                <div className="grid grid-cols-4 gap-4 mb-8">
                                    <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-full bg-[#128C7E] text-white flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-md shadow-[#128C7E]/20">
                                            <MessageCircle size={22} className="fill-current" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">WhatsApp</span>
                                    </button>

                                    <button onClick={handleTelegram} className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-full bg-[#0088cc] text-white flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-md shadow-[#0088cc]/20">
                                            <Send size={20} className="ml-1" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Telegram</span>
                                    </button>

                                    <button onClick={handleTwitter} className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-md shadow-black/20">
                                            <TwitterIcon size={18} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">X (Twitter)</span>
                                    </button>

                                    <button onClick={handleEmail} className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-md shadow-slate-300">
                                            <Mail size={22} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Email</span>
                                    </button>
                                </div>

                                {/* Copy Link */}
                                <div className="flex items-center p-1 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800">
                                    <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 truncate flex-1 min-w-0 font-medium">
                                        {shareUrl}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={copied ? "primary" : "secondary"}
                                        className={`rounded-lg px-4 flex items-center gap-2 shrink-0 ${copied ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' : 'bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-none'}`}
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={16} /> Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} /> Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
