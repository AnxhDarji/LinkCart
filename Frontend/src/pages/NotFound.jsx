import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const pageBg = { background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' };

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col" style={pageBg}>
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <h1 className="text-8xl font-black text-indigo-600 mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>404</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Clash Display, sans-serif' }}>Page Not Found</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-10 leading-relaxed">
                    Oops! The item or page you are trying to access is not available, or the link may be broken.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 transition-all duration-200"
                >
                    Return to Homepage
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default NotFound;
