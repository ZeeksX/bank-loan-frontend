import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import LoanCard from './LoanCard';

const getStatusIcon = (status) => {
    switch (status) {
        case 'approved':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'pending':
            return <Clock className="w-5 h-5 text-amber-500" />;
        case 'submitted':
            return <Clock className="w-5 h-5 text-amber-500" />;
        case 'under_review':
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
        case 'approved':
            return 'Active';
        case 'pending':
            return 'Pending Approval';
        case 'submitted':
            return 'Submitted';
        case 'under_review':
            return 'Under Review';
        case 'completed':
            return 'Completed';
        case 'rejected':
            return 'Rejected';
        default:
            return '';
    }
};

const MyLoans = () => {
    const [loans, setLoans] = useState([]);
    const { productData, myLoans } = useOutletContext() ?? { productData: [], myLoans: [] };
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Retrieve customerId from localStorage
    const customerId = JSON.parse(localStorage.getItem('user'))?.userId;

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/loans/customer/${customerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                if (!response.ok) throw new Error('Error fetching loans');
                const data = await response.json();
                console.log('Data from the backend: ', data);
                setLoans(data.data);
            } catch (err) {
                console.error("Error fetching customer loans: ", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [customerId]);

    const filterLoans = (loans, status) => {
        if (!status || status === 'all') return loans;
        return loans.filter(loan => loan.status === status);
    };

    const filteredLoans = filterLoans(loans, activeTab);
    const tabOptions = ['all', 'approved', 'pending', 'submitted', 'under_review', 'completed', 'rejected'];

    if (loading) {
        return <div className="text-center text-gray-700">Loading loans...</div>;
    }

    return (
        <div className="w-[95vw] inter mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-gray-900"
                >
                    My Loans
                </motion.h1>
                <Link to="/apply">
                    <button
                        type="button"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-4 md:mt-0 whitespace-nowrap"
                    >
                        Apply for a New Loan
                    </button>
                </Link>
            </div>

            {/* Tabs */}
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
                            {tab.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Loans
                        </button>
                    ))}
                </div>
            </div>

            {/* Loan Cards */}
            {filteredLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLoans.map((loan) => (
                        <LoanCard
                            key={loan.id || loan.loan_id}
                            loan={loan}
                            getStatusIcon={getStatusIcon}
                            getStatusText={getStatusText}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl p-12 text-center border border-gray-200 shadow-md">
                    <h3 className="text-xl font-medium mb-2 text-gray-800">No loans found</h3>
                    <p className="text-gray-500 mb-6">
                        You don't have any {activeTab !== 'all' ? activeTab : ''} loans yet.
                    </p>
                    <Link to="/apply">
                        <button
                            type="button"
                            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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