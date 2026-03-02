import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, Flag, LogOut, Menu, X } from 'lucide-react';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize mock data
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Active' },
        { id: 3, name: 'Mike Chen', email: 'mike@example.com', status: 'Disabled' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', status: 'Active' }
    ];

    const mockReports = [
        { id: 1, productTitle: 'iPhone 13 Pro', productId: 2, reason: 'Fake Product', reporter: 'User123' },
        { id: 2, productTitle: 'Designer Bag', productId: 5, reason: 'Scam', reporter: 'User456' },
        { id: 3, productTitle: 'Concert Tickets', productId: 6, reason: 'Spam', reporter: 'User789' }
    ];

    // State management
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalReports: 0
    });

    // Load data from localStorage on mount
    useEffect(() => {
        // Load users
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(savedUsers.length > 0 ? savedUsers : mockUsers);

        // Load products from myListings
        const savedProducts = JSON.parse(localStorage.getItem('myListings') || '[]');
        setProducts(savedProducts);

        // Load reports
        const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(savedReports);
    }, []);

    // Update stats when data changes
    useEffect(() => {
        setStats({
            totalUsers: users.length,
            totalProducts: products.length,
            totalReports: reports.length
        });
    }, [users, products, reports]);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'reports', label: 'Reports', icon: Flag }
    ];

    // PART 1: Users Management
    const handleUserAction = (userId, currentStatus) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    status: currentStatus === 'Active' ? 'Disabled' : 'Active'
                };
            }
            return user;
        });
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    // PART 2: Products Management
    const handleRemoveProduct = (productId) => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('myListings', JSON.stringify(updatedProducts));
    };

    // PART 3: Reports Management
    const handleDismissReport = (reportId) => {
        const updatedReports = reports.filter(report => report.id !== reportId);
        setReports(updatedReports);
        localStorage.setItem('reports', JSON.stringify(updatedReports));
    };

    const handleRemoveListing = (reportId) => {
        // Find the report to get product ID
        const report = reports.find(r => r.id === reportId);
        
        if (report && report.productId) {
            // Remove product from listings
            const updatedProducts = products.filter(product => product.id !== report.productId);
            setProducts(updatedProducts);
            localStorage.setItem('myListings', JSON.stringify(updatedProducts));
        }
        
        // Remove report
        const updatedReports = reports.filter(r => r.id !== reportId);
        setReports(updatedReports);
        localStorage.setItem('reports', JSON.stringify(updatedReports));
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Mobile Menu Button */}
            <button 
                className="fixed top-4 left-4 z-50 lg:hidden bg-white p-3 rounded-xl shadow-lg border border-slate-200"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 shadow-xl z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-200">
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Clash Display, sans-serif' }}>Admin Panel</h1>
                </div>
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                                    activeSection === item.id 
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                                        : 'text-gray-700 hover:bg-slate-100'
                                }`}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    setSidebarOpen(false);
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all mt-4">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-12">
                {/* Dashboard Section */}
                {activeSection === 'dashboard' && (
                    <div>
                        <h1 className="text-4xl font-extrabold mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
                                        <Users size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Total Users</p>
                                        <p className="text-3xl font-extrabold text-gray-800">{stats.totalUsers}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl">
                                        <Package size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Total Products</p>
                                        <p className="text-3xl font-extrabold text-gray-800">{stats.totalProducts}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl">
                                        <Flag size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Total Reports</p>
                                        <p className="text-3xl font-extrabold text-gray-800">{stats.totalReports}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Section */}
                {activeSection === 'users' && (
                    <div>
                        <h1 className="text-4xl font-extrabold mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>Users Management</h1>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        user.status === 'Active' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                                            user.status === 'Active' 
                                                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                                                : 'bg-green-500 text-white hover:bg-green-600'
                                                        }`}
                                                        onClick={() => handleUserAction(user.id, user.status)}
                                                    >
                                                        {user.status === 'Active' ? 'Disable' : 'Enable'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Section */}
                {activeSection === 'products' && (
                    <div>
                        <h1 className="text-4xl font-extrabold mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>Products Management</h1>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Title</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Seller</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-800">{product.title}</td>
                                                <td className="px-6 py-4 text-gray-600">{product.seller}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
                                                        onClick={() => handleRemoveProduct(product.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports Section */}
                {activeSection === 'reports' && (
                    <div>
                        <h1 className="text-4xl font-extrabold mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>Reports Management</h1>
                        <div className="space-y-4">
                            {reports.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xl">
                                    <p className="text-gray-500 text-lg">No reports to display</p>
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{report.productTitle}</h3>
                                                <p className="text-gray-600 mb-1"><span className="font-semibold">Reason:</span> {report.reason}</p>
                                                {report.description && (
                                                    <p className="text-gray-600"><span className="font-semibold">Description:</span> {report.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    className="px-4 py-2 rounded-lg font-semibold border-2 border-slate-300 text-gray-700 hover:bg-slate-50 transition-all"
                                                    onClick={() => handleDismissReport(report.id)}
                                                >
                                                    Dismiss
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
                                                    onClick={() => handleRemoveListing(report.id)}
                                                >
                                                    Remove Listing
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
