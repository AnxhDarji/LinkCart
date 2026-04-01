import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Loader2, Info, ArrowLeft, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { useToast } from '../context/ToastContext';

const StatusBadge = ({ status }) => {
    switch (status?.toLowerCase()) {
        case 'approved':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <CheckCircle size={14} /> Approved
                </span>
            );
        case 'rejected':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    <XCircle size={14} /> Rejected
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    <Clock size={14} /> Pending
                </span>
            );
    }
};

const MyReportsDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE}/api/reports/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReports(data);
                } else {
                    toast.error('Failed to load your reports');
                }
            })
            .catch(() => toast.error('Connection error while fetching reports'))
            .finally(() => setLoading(false));
    }, [navigate, toast]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate('/account')}
                    className="flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:text-indigo-800 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>

                <div className="mb-10 block">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        My Reports
                    </h1>
                    <p className="text-gray-500 mt-2">Track the status of products you've reported.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 size={40} className="animate-spin text-indigo-600" />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
                            <Flag size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Submitted</h3>
                        <p className="text-gray-500">You haven't reported any products yet. Reports help keep our community safe.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="mt-6 px-6 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors inline-block"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={report.status} />
                                            <span className="text-sm text-gray-400 font-medium ml-2">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <Flag size={14} className="text-gray-400" /> Reason
                                        </h4>
                                        <p className="text-gray-800 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">{report.reason}</p>
                                    </div>
                                </div>

                                <div className="md:w-1/3 md:border-l md:border-gray-100 md:pl-6 flex flex-col justify-center">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Product</h4>
                                    
                                    {report.productTitle ? (
                                        <div className="space-y-3">
                                            <p className="font-bold text-gray-900 line-clamp-2">{report.productTitle}</p>
                                            <button 
                                                onClick={() => navigate(`/p/${report.productSlug}`)}
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                            >
                                                View Product <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-2.5">
                                            <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-700 font-medium">This product has been removed from the platform.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MyReportsDashboard;
