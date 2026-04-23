import React from 'react';

const ToggleSwitch = ({ label, description, checked, onChange, disabled }) => {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
            </div>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${checked ? 'bg-purple-600' : 'bg-slate-300'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                aria-pressed={checked}
                aria-label={label}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;

