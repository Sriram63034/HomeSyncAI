import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, User, Building } from 'lucide-react';
import { Button } from './ui/Button';

interface AgentContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent?: {
        name: string;
        phone: string;
        email: string;
        agency: string;
        photoUrl?: string;
    };
}

export const AgentContactModal: React.FC<AgentContactModalProps> = ({ isOpen, onClose, agent }) => {
    // Default mock data if agent prop is not provided
    const agentData = agent || {
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        email: 'rahul@realestate.com',
        agency: 'Mumbai Prime Realty'
    };

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
                        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-100 dark:border-slate-800 relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Header / Avatar */}
                            <div className="bg-slate-50 dark:bg-slate-800 p-8 pb-6 flex flex-col items-center border-b border-slate-100 dark:border-slate-800">
                                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-md">
                                    {agentData.photoUrl ? (
                                        <img src={agentData.photoUrl} alt={agentData.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-primary-500" />
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">{agentData.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">
                                    <Building size={14} /> {agentData.agency}
                                </p>
                            </div>

                            {/* Details & Actions */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Phone</p>
                                            <p className="text-slate-900 dark:text-white font-semibold">{agentData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Email</p>
                                            <p className="text-slate-900 dark:text-white font-semibold truncate">
                                                <a href={`mailto:${agentData.email}`} className="hover:text-blue-600 transition-colors">
                                                    {agentData.email}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button 
                                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-600/20" 
                                        onClick={() => window.location.href = `tel:${agentData.phone}`}
                                    >
                                        <Phone size={18} /> Call Agent
                                    </Button>
                                    <Button 
                                        className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800" 
                                        onClick={() => window.location.href = `mailto:${agentData.email}`}
                                    >
                                        <Mail size={18} /> Send Email
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
