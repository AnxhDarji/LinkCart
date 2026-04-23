import React from 'react';

const fieldState = (error, value) => {
    if (error) return 'border-red-400 focus:ring-red-100 focus:border-red-400';
    if (!error && value) return 'border-emerald-400 focus:ring-emerald-100 focus:border-emerald-400';
    return 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-400';
};

const inputBase = 'w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200';

const InputField = ({
    icon: Icon,
    type = 'text',
    name,
    value,
    placeholder,
    onChange,
    onBlur,
    disabled,
    error,
    autoComplete,
    inputMode,
    maxLength,
}) => {
    return (
        <div>
            <div className="relative">
                {Icon ? (
                    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                ) : null}
                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    maxLength={maxLength}
                    className={`${inputBase} ${fieldState(error, value)} ${disabled ? 'disabled:bg-slate-50 disabled:text-slate-500' : ''}`}
                />
            </div>
            {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
        </div>
    );
};

export default InputField;

