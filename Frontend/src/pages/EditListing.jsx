import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data based on ID
    const mockListings = {
        1: { title: 'Vintage Leather Jacket', price: 299, location: 'New York, NY', description: 'Beautiful vintage leather jacket in excellent condition.' },
        2: { title: 'iPhone 13 Pro', price: 799, location: 'Los Angeles, CA', description: 'Barely used iPhone 13 Pro with all accessories.' },
        3: { title: 'Gaming Laptop', price: 1299, location: 'Chicago, IL', description: 'High-performance gaming laptop with RTX graphics.' },
        4: { title: 'Wireless Headphones', price: 149, location: 'Houston, TX', description: 'Premium wireless headphones with noise cancellation.' }
    };

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        // Load from localStorage first
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        const savedProduct = savedListings.find(p => p.id === parseInt(id));
        
        if (savedProduct) {
            setFormData({
                title: savedProduct.title || '',
                price: savedProduct.price || '',
                location: savedProduct.location || '',
                description: savedProduct.description || ''
            });
        } else if (mockListings[id]) {
            setFormData(mockListings[id]);
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Get all listings from localStorage
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        
        // Find and update the matching product
        const updatedListings = savedListings.map(listing => {
            if (listing.id === parseInt(id)) {
                return {
                    ...listing,
                    title: formData.title,
                    price: parseFloat(formData.price),
                    location: formData.location,
                    description: formData.description
                };
            }
            return listing;
        });
        
        // Save back to localStorage
        localStorage.setItem('myListings', JSON.stringify(updatedListings));
        
        // Navigate to My Listings
        navigate('/my-listings');
    };

    const handleCancel = () => {
        navigate('/my-listings');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
                        <h1 className="text-4xl font-extrabold mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>Edit Listing</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter product title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter location"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-vertical"
                                    rows="5"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    className="flex-1 border-2 border-slate-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 hover:shadow-xl transition-all"
                                >
                                    Update Listing
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
