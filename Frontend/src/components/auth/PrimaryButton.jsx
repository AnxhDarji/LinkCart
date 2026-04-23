import React from 'react';
import { Loader2 } from 'lucide-react';

const PrimaryButton = ({ children, loading, disabled, type = 'button', onClick }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : children}
        </button>
    );
};

export default PrimaryButton;

