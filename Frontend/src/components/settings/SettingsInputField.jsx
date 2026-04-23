import React from 'react';

const base =
    'w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200';

const SettingsInputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled,
    readOnly,
    error,
    helper,
    autoComplete,
}) => {
    return (
        <div>
            {label ? (
                <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                </label>
            ) : null}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoComplete={autoComplete}
                className={`${base} ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'} ${readOnly ? 'bg-slate-50 text-slate-600' : ''}`}
            />
            {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
            {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
        </div>
    );
};

export default SettingsInputField;

