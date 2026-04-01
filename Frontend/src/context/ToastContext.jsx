import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };
        
        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    const getToastColors = (type) => {
        switch (type) {
            case 'success':
                return 'bg-[#10b981] text-white border-[#059669] shadow-[0_8px_30px_rgb(16,185,129,0.3)]';
            case 'error':
                return 'bg-[#ef4444] text-white border-[#b91c1c] shadow-[0_8px_30px_rgb(239,68,68,0.3)]';
            case 'warning':
                return 'bg-[#f59e0b] text-white border-[#b45309] shadow-[0_8px_30px_rgb(245,158,11,0.3)]';
            case 'info':
            default:
                return 'bg-[#3b82f6] text-white border-[#1d4ed8] shadow-[0_8px_30px_rgb(59,130,246,0.3)]';
        }
    };

    const getToastIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-white shrink-0 mt-0.5" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />;
        }
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 p-4 border rounded-xl shadow-lg transition-all duration-300 ease-in-out transform scale-100 opacity-100 translate-y-0 ${getToastColors(toast.type)}`}
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                    >
                        {getToastIcon(toast.type)}
                        <p className="flex-1 text-sm font-medium leading-relaxed drop-shadow-sm">
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-white/70 hover:text-white transition-colors shrink-0"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
