import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import AuthCard from '../components/auth/AuthCard';
import InputField from '../components/auth/InputField';
import PrimaryButton from '../components/auth/PrimaryButton';
import { useToast } from '../context/ToastContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const emailError = useMemo(() => {
        if (!error) return '';
        return error;
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
            setError('Enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: normalizedEmail }),
            });
            const data = await res.json();

            if (!res.ok || data?.success === false) {
                const msg = data?.message || 'Failed to send OTP.';
                setError(msg);
                toast.error(msg);
                return;
            }

            const message = data.message || 'OTP sent successfully.';
            setSuccess(message);
            toast.success(message);
            navigate(`/verify-otp?email=${encodeURIComponent(normalizedEmail)}`, { state: { email: normalizedEmail } });
        } catch {
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div
                className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-14"
                style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }}
            >
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            LinkCart
                        </span>
                        <p className="mt-2 text-slate-500 text-sm">We’ll send a one-time code to your email</p>
                    </div>

                    <AuthCard title="Forgot Password" subtitle="Enter your registered email to receive an OTP.">
                        {emailError ? (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                                {emailError}
                            </div>
                        ) : null}
                        {success ? (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-4">
                                {success}
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            <InputField
                                icon={Mail}
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                    if (success) setSuccess('');
                                }}
                                autoComplete="email"
                            />

                            <PrimaryButton type="submit" loading={loading}>
                                Send OTP
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 pt-6 border-t">
                            <p className="text-center text-sm text-slate-500">
                                Remembered your password?{' '}
                                <Link to="/login" className="text-indigo-600 font-semibold">
                                    Back to login
                                </Link>
                            </p>
                        </div>
                    </AuthCard>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ForgotPassword;
