import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageOff, MapPin, Calendar, Search, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { getProductImageSrc } from '../utils/productImage';
import UserAvatar from '../components/UserAvatar';
import ProductStatusBadge from '../components/ProductStatusBadge';
import { formatINR } from '../utils/currency';

const ImagePlaceholder = () => (
    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center gap-2 text-slate-400">
        <ImageOff size={32} />
        <span className="text-xs font-medium">No Image Available</span>
    </div>
);

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/api/products/public`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setProducts(data);
                else setError(data.error || 'Failed to load products');
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false));
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const filteredProducts = products.filter((product) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = product.title.toLowerCase().includes(query) || 
                              (product.description && product.description.toLowerCase().includes(query));
        
        const price = Number(product.price) || 0;
        const min = minPrice ? Number(minPrice) : 0;
        const max = maxPrice ? Number(maxPrice) : Infinity;
        
        const matchesPrice = price >= min && price <= max;

        return matchesSearch && matchesPrice;
    }).sort((a, b) => {
        if (sortOrder === 'low-to-high') return Number(a.price) - Number(b.price);
        if (sortOrder === 'high-to-low') return Number(b.price) - Number(a.price);
        return new Date(b.created_at) - new Date(a.created_at); // default fallback
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        All Products
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min ₹"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-24 px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                            />
                            <div className="flex items-center text-gray-400">-</div>
                            <input
                                type="number"
                                placeholder="Max ₹"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-24 px-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex items-center">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full sm:w-auto px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm cursor-pointer"
                            >
                                <option value="">Sort by: Newest</option>
                                <option value="low-to-high">Price: Low to High</option>
                                <option value="high-to-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading && <p className="text-center text-gray-500 py-20">Loading...</p>}
                {error && <p className="text-center text-red-500 py-20">{error}</p>}
                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <Filter size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No products match your search or filters.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setMinPrice(''); setMaxPrice(''); setSortOrder(''); }}
                            className="mt-4 text-indigo-600 font-semibold hover:text-indigo-800"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const imageSrc = getProductImageSrc(product);
                            return (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
                                onClick={() => navigate(`/p/${product.slug}`)}
                            >
                                <div className="overflow-hidden">
                                    {imageSrc ? (
                                        <img src={imageSrc} alt={product.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg mb-1 truncate">{product.title}</h3>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        {formatINR(product.price)}
                                    </p>
                                    {product.location && (
                                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                            <MapPin size={13} />
                                            <span className="truncate">{product.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                                        <Calendar size={12} />
                                        <span>{new Date(product.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <button
                                            className="min-w-0 flex items-center gap-2 text-left"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/user/${product.user_id}`); }}
                                        >
                                            <UserAvatar user={product} size="sm" className="w-9 h-9 text-xs shadow-md" />
                                            <span className="truncate text-sm font-semibold text-indigo-700 hover:text-indigo-800 transition-colors">
                                                {product.seller_name || product.user_id}
                                            </span>
                                        </button>
                                        <ProductStatusBadge status={product.status} />
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Products;
