import React from 'react';

const SettingsForm = ({ title, description, children, footer }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 md:p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
            </div>

            <div className="space-y-5">{children}</div>

            {footer ? <div className="mt-7 pt-6 border-t border-slate-100">{footer}</div> : null}
        </div>
    );
};

export default SettingsForm;

