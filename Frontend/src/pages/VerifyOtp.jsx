import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import AuthCard from '../components/auth/AuthCard';
import InputField from '../components/auth/InputField';
import PrimaryButton from '../components/auth/PrimaryButton';
import { useToast } from '../context/ToastContext';

const getEmailFromLocation = (location) => {
    const params = new URLSearchParams(location.search);
    return (location.state?.email || params.get('email') || '').trim().toLowerCase();
};

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const email = useMemo(() => getEmailFromLocation(location), [location]);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const otpError = useMemo(() => {
        if (!error) return '';
        return error;
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is missing. Please restart the flow.');
            return;
        }

        const sanitizedOtp = otp.replace(/\D/g, '').slice(0, 6);
        if (sanitizedOtp.length !== 6) {
            setError('Enter the 6-digit OTP.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: sanitizedOtp }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'OTP verification failed.');
                return;
            }

            const message = data.message || 'OTP verified successfully.';
            toast.success(message);
            navigate(`/reset-password?email=${encodeURIComponent(email)}`, { state: { email } });
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
                        <p className="mt-2 text-slate-500 text-sm">
                            {email ? `Enter the 6-digit code sent to ${email}` : 'Enter the 6-digit code'}
                        </p>
                    </div>

                    <AuthCard title="OTP Verification" subtitle="This code expires in a few minutes.">
                        {otpError ? (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                                {otpError}
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            <InputField
                                icon={ShieldCheck}
                                type="text"
                                name="otp"
                                placeholder="6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                inputMode="numeric"
                                maxLength={6}
                                autoComplete="one-time-code"
                            />

                            <PrimaryButton type="submit" loading={loading}>
                                Verify OTP
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 pt-6 border-t">
                            <p className="text-center text-sm text-slate-500">
                                Didn’t get the code?{' '}
                                <Link to="/forgot-password" className="text-indigo-600 font-semibold">
                                    Resend OTP
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

export default VerifyOtp;

