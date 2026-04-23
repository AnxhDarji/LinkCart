import React from 'react';

const base =
    'w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200';

const SettingsTextArea = ({ label, name, value, onChange, placeholder, rows = 4, helper, error, maxLength }) => {
    return (
        <div>
            {label ? (
                <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                </label>
            ) : null}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className={`${base} resize-none ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`}
            />
            <div className="mt-1 flex items-center justify-between gap-3">
                <div>
                    {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
                    {error ? <p className="text-xs text-red-500">{error}</p> : null}
                </div>
                {typeof maxLength === 'number' ? (
                    <p className="text-xs text-slate-400">
                        {String(value || '').length}/{maxLength}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default SettingsTextArea;

