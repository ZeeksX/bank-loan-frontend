// src/components/Toast.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBackground = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-amber-50 border-amber-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed top-4 right-4 z-50 max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`rounded-lg border ${getBackground()} p-4 shadow-md flex items-start gap-3`}
                >
                    {getIcon()}
                    <div className="flex-1">{message}</div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Toast;