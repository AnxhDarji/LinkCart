import React from 'react';

const SettingsLayout = ({ title, subtitle, children }) => {
    return (
        <div
            className="min-h-[calc(100vh-80px)] px-4 py-12"
            style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }}
        >
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h1>
                    {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
                </div>
                {children}
            </div>
        </div>
    );
};

export default SettingsLayout;

