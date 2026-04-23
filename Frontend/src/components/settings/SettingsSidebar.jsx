import React from 'react';

const tabBase =
    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200';

const SettingsSidebar = ({ tabs, activeKey, onChange }) => {
    return (
        <>
            {/* Mobile: top tabs */}
            <div className="md:hidden mb-4">
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-2 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const isActive = tab.key === activeKey;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => onChange(tab.key)}
                                    className={`${tabBase} whitespace-nowrap ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'
                                        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                                    }`}
                                >
                                    {tab.icon ? <tab.icon size={16} /> : null}
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Desktop: sidebar */}
            <div className="hidden md:block">
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-3 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">
                    <p className="px-3 pt-2 pb-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                        Settings
                    </p>
                    <div className="flex flex-col gap-1">
                        {tabs.map((tab) => {
                            const isActive = tab.key === activeKey;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => onChange(tab.key)}
                                    className={`${tabBase} ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'
                                        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                                    }`}
                                >
                                    {tab.icon ? <tab.icon size={16} /> : null}
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsSidebar;

