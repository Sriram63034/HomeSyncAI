import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface ScheduleTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
}

const TIME_SLOTS = [
    '10:00 AM',
    '12:00 PM',
    '02:00 PM',
    '04:00 PM',
];

export const ScheduleTourModal: React.FC<ScheduleTourModalProps> = ({ isOpen, onClose, propertyId }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Mock booked slots pattern for demo
    const isSlotBooked = (t: string) => {
        // e.g. Just mock randomly based on date length to show feature
        if (!date) return false;
        if (date.endsWith('2') && t === '12:00 PM') return true;
        if (date.endsWith('5') && t === '04:00 PM') return true;
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Simulate API call to /api/tours/schedule
            console.log('Scheduling tour for property:', propertyId, { name, email, phone, date, time });
            // const response = await fetch('/api/tours/schedule', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ propertyId, userName: name, email, phone, date, time })
            // });
            // if (!response.ok) throw new Error('Failed to schedule tour');
            
            // Mocking the API delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            setSuccess(true);
            setTimeout(() => {
                onClose();
                // Reset form after closing
                setTimeout(() => {
                    setSuccess(false);
                    setDate('');
                    setTime('');
                    setName('');
                    setPhone('');
                    setEmail('');
                }, 300);
            }, 2500);

        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
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
                            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-100 relative"
                        >
                            {/* Close Button */}
                            {!success && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                                >
                                    <X size={20} />
                                </button>
                            )}

                            {success ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 15 }}
                                        className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2 shadow-inner"
                                    >
                                        <CheckCircle size={40} />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-slate-900">Tour Scheduled!</h2>
                                    <p className="text-slate-600">Your property tour for {date} at {time} has been scheduled successfully. The agent will contact you soon.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-50 p-6 border-b border-slate-100">
                                        <h2 className="text-2xl font-bold text-slate-900">Schedule a Tour</h2>
                                        <p className="text-sm text-slate-500 mt-1">Select a date and time that works for you.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                        {/* Date and Time Selection */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 block">Date</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                        <Calendar size={18} className="text-slate-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={date}
                                                        onChange={(e) => {
                                                            setDate(e.target.value);
                                                            setTime(''); // Reset time when date changes
                                                        }}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-700"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 block">Time Slot</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                        <Clock size={18} className="text-slate-400" />
                                                    </div>
                                                    <select
                                                        required
                                                        value={time}
                                                        onChange={(e) => setTime(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-700 appearance-none"
                                                    >
                                                        <option value="" disabled>Select a time</option>
                                                        {TIME_SLOTS.map((slot) => {
                                                            const booked = isSlotBooked(slot);
                                                            return (
                                                                <option key={slot} value={slot} disabled={booked}>
                                                                    {slot} {booked ? '(Booked)' : ''}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Details */}
                                        <div className="space-y-4 pt-2 border-t border-slate-100">
                                            <h3 className="text-sm font-semibold text-slate-900">Your Details</h3>
                                            
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <User size={18} className="text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-700"
                                                />
                                            </div>

                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <Mail size={18} className="text-slate-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-700"
                                                />
                                            </div>

                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <Phone size={18} className="text-slate-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    required
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                                {error}
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                disabled={loading}
                                                className="w-full border-primary-600 text-primary-600 hover:bg-primary-50 py-3"
                                            >
                                                {loading ? 'Scheduling...' : 'Confirm Schedule Tour'}
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
