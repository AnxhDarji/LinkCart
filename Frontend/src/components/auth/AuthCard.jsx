import React from 'react';

const AuthCard = ({ title, subtitle, children }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
            </div>
            {children}
        </div>
    );
};

export default AuthCard;

