// File: MyLoans.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoanCard from './LoanCard';

const getStatusIcon = (status) => {
    switch (status) {
        case 'active':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'pending':
            return <Clock className="w-5 h-5 text-amber-500" />;
        case 'completed':
            return <CheckCircle className="w-5 h-5 text-blue-500" />;
        case 'rejected':
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        default:
            return null;
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'active':
            return 'Active';
        case 'pending':
            return 'Pending Approval';
        case 'completed':
            return 'Completed';
        case 'rejected':
            return 'Rejected';
        default:
            return '';
    }
};

const filterLoans = (loans, status) => {
    if (!status || status === 'all') return loans;
    return loans.filter(loan => loan.status === status);
};

const MyLoans = () => {
    const [loans, setLoans] = useState([]); 
    const [activeTab, setActiveTab] = useState('all'); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // In production, retrieve this from authentication context or similar.
    const customerId = JSON.parse(localStorage.getItem('user')).userId;


    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/loans/customer/${customerId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error fetching loans');
                }
                const data = await response.json();
                console.log('Data from the backend: ', data)
                setLoans(data.data);
            } catch (err) {
                console.error("Error fetching customer loans: ", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [customerId]);


    const filteredLoans = filterLoans(loans, activeTab);
    const tabOptions = ['all', 'active', 'pending', 'completed', 'rejected'];

    return (
        <div className="w-[95vw] inter mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900"
                    >
                        My Loans
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-gray-500 mt-2"
                    >
                        View and manage all your loan applications and active loans
                    </motion.p>
                </div>

                <Link to="/apply">
                    <button
                        type="button"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-4 md:mt-0 whitespace-nowrap"
                    >
                        Apply for a New Loan
                    </button>
                </Link>
            </div>

            <div className="mb-8">
                <div className="flex space-x-1 rounded-lg bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg p-1 border border-gray-200 shadow-sm overflow-x-auto">
                    {tabOptions.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} Loans
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-700">Loading loans...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : filteredLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLoans.map((loan) => (
                        <LoanCard key={loan.id} loan={loan} getStatusIcon={getStatusIcon} getStatusText={getStatusText} />
                    ))}
                </div>
            ) : (
                <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl p-12 text-center border border-gray-200 shadow-md">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2 text-gray-800">No loans found</h3>
                    <p className="text-gray-500 mb-6">
                        You don't have any {activeTab !== 'all' ? activeTab : ''} loans yet.
                    </p>
                    <Link to="/apply">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Apply for a Loan
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyLoans;