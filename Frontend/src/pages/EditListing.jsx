import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, MapPin, AlignLeft, ArrowRight, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useToast } from '../context/ToastContext';
import API_BASE from '../utils/api';

const inputBase = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200';

const RupeeIcon = ({ size = 12, className = '' }) => (
    <span aria-hidden="true" className={`inline-flex items-center justify-center font-semibold leading-none ${className}`.trim()} style={{ fontSize: size }}>₹</span>
);

const Label = ({ icon: Icon, children }) => (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        <Icon size={12} className="text-indigo-400" />{children}
    </label>
);

const EditListing = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();
    const toast      = useToast();

    const [formData, setFormData] = useState({ title: '', price: '', location: '', description: '' });
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE}/api/products/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const product = data.find(p => String(p.id) === String(id));
                    if (product) {
                        setFormData({
                            title: product.title || '',
                            price: product.price || '',
                            location: product.location || '',
                            description: product.description || ''
                        });
                    } else {
                        toast.error('Listing not found or you are unauthorized.');
                        navigate('/my-listings');
                    }
                }
            })
            .catch(() => toast.error('Failed to connect to server'))
            .finally(() => setLoading(false));
    }, [id, navigate, toast]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setSaving(true);
        
        try {
            const res = await fetch(`${API_BASE}/api/products/${id}/edit`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success('Listing updated successfully!');
                navigate('/my-listings');
            } else {
                toast.error(data.error || 'Failed to update listing.');
            }
        } catch(err) {
            toast.error('Server error updating listing.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }} className="min-h-screen">

            {/* decorative blobs */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div style={{ width: 500, height: 500, top: '-140px', left: '-140px', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                <div style={{ width: 420, height: 420, bottom: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
            </div>

            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="max-w-3xl mx-auto">

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-slate-800" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        Edit Listing
                    </h1>
                    <p className="text-slate-500 text-sm mb-10">Update your listing details below.</p>

                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label icon={Tag}>Title</Label>
                                <input type="text" name="title" className={inputBase} value={formData.title} onChange={handleChange} placeholder="Enter product title" required />
                            </div>
                            <div>
                                <Label icon={RupeeIcon}>Price</Label>
                                <input type="number" name="price" className={inputBase} value={formData.price} onChange={handleChange} placeholder="Enter price" required />
                            </div>
                            <div>
                                <Label icon={MapPin}>Location</Label>
                                <input type="text" name="location" className={inputBase} value={formData.location} onChange={handleChange} placeholder="Enter location" required />
                            </div>
                            <div>
                                <Label icon={AlignLeft}>Description</Label>
                                <textarea name="description" className={`${inputBase} resize-vertical`} rows={5} value={formData.description} onChange={handleChange} placeholder="Enter product description" required />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/my-listings')}
                                    className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 min-w-0"
                                >
                                    <X size={15} />Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || saving}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <span>{saving ? 'Updating...' : 'Update Listing'}</span>
                                    {!saving && <ArrowRight size={15} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditListing;
