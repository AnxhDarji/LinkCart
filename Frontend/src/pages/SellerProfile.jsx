import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SellerProfile = () => {
    const navigate = useNavigate();
    const seller = {
        id: 1,
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/120',
        rating: 4.5,
        totalReviews: 28
    };

    const listings = [
        { id: 1, title: 'Vintage Leather Jacket', price: 299, status: 'Active', image: 'https://via.placeholder.com/300x200' },
        { id: 2, title: 'Gaming Laptop', price: 1299, status: 'Active', image: 'https://via.placeholder.com/300x200/0D9488' },
        { id: 3, title: 'Wireless Headphones', price: 149, status: 'Active', image: 'https://via.placeholder.com/300x200/065F46' },
        { id: 4, title: 'Smart Watch', price: 399, status: 'Active', image: 'https://via.placeholder.com/300x200/10B981' },
        { id: 5, title: 'Camera Lens', price: 599, status: 'Active', image: 'https://via.placeholder.com/300x200/EF4444' },
        { id: 6, title: 'Mechanical Keyboard', price: 179, status: 'Active', image: 'https://via.placeholder.com/300x200/F59E0B' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl mb-12">
                    <div className="flex items-center gap-6">
                        <img src={seller.avatar} alt={seller.name} className="w-32 h-32 rounded-full border-4 border-indigo-100 shadow-lg" />
                        <div>
                            <h1 className="text-4xl font-extrabold mb-3" style={{ fontFamily: 'Clash Display, sans-serif' }}>{seller.name}</h1>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} fill={i < Math.floor(seller.rating) ? '#FCD34D' : 'none'} color={i < Math.floor(seller.rating) ? '#FCD34D' : '#D1D5DB'} />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">{seller.rating} ({seller.totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Clash Display, sans-serif' }}>Active Listings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer" onClick={() => navigate(`/product/${listing.id}`)}>
                                <div className="relative">
                                    <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                                    <span className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">{listing.status}</span>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold mb-2 text-gray-800">{listing.title}</h3>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">${listing.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SellerProfile;
