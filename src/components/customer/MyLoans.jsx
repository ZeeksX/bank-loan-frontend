// MyLoans.jsx (Converted to JSX with standard HTML tags for UI elements)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
// Removed CustomButton import
// Removed Tabs imports
// Removed Progress import
import { Link } from 'react-router-dom';

// Removed LoanStatus type
// Removed Loan interface

// Data remains the same structure
const loans = [
    {
        id: 'BL-192837',
        name: 'Home Renovation Loan',
        amount: '$25,000',
        amountPaid: '$5,500',
        dueDate: 'July 15, 2025',
        nextPayment: '$540',
        progress: 22,
        status: 'active',
        date: 'January 15, 2023',
    },
    {
        id: 'BL-567890',
        name: 'Education Loan',
        amount: '$12,000',
        amountPaid: '$6,800',
        dueDate: 'March 20, 2024',
        nextPayment: '$280',
        progress: 57,
        status: 'active',
        date: 'August 10, 2022',
    },
    {
        id: 'BL-345678',
        name: 'Car Loan',
        amount: '$18,500',
        amountPaid: '$8,300',
        dueDate: 'May 5, 2025',
        nextPayment: '$450',
        progress: 45,
        status: 'active',
        date: 'May 5, 2022',
    },
    {
        id: 'BL-789012',
        name: 'Business Expansion Loan',
        amount: '$35,000',
        amountPaid: '$0',
        dueDate: 'N/A',
        nextPayment: 'N/A',
        progress: 0,
        status: 'pending',
        date: 'June 1, 2023',
    },
    {
        id: 'BL-123456',
        name: 'Personal Loan',
        amount: '$8,000',
        amountPaid: '$8,000',
        dueDate: 'Completed',
        nextPayment: 'N/A',
        progress: 100,
        status: 'completed',
        date: 'January 10, 2022',
    },
    {
        id: 'BL-654321',
        name: 'Vacation Loan',
        amount: '$5,000',
        amountPaid: 'N/A',
        dueDate: 'N/A',
        nextPayment: 'N/A',
        progress: 0,
        status: 'rejected',
        date: 'April 15, 2023',
    },
];

// Removed type annotation from status parameter
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

// Removed type annotation from status parameter
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

// Removed type annotation from props parameter ({ loan })
const LoanCard = ({ loan }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
            // Assuming 'glass-card' is a custom class defined elsewhere or needs replacement
            // Replaced border-secondary with a standard Tailwind border color
            className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-md"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center">
                        <div className="mr-2">{getStatusIcon(loan.status)}</div>
                        {/* Assuming text-muted-foreground maps to something like text-gray-500 */}
                        <span className="text-sm font-medium text-gray-500">{getStatusText(loan.status)}</span>
                    </div>
                    <h3 className="text-lg font-medium mt-2 text-gray-900">{loan.name}</h3>
                </div>
                <div className="text-sm text-right">
                    {/* Assuming text-muted-foreground maps to something like text-gray-500 */}
                    <div className="text-gray-500">Loan ID</div>
                    <div className="text-gray-800">{loan.id}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <div className="text-sm text-gray-500">Loan Amount</div>
                    <div className="font-medium text-gray-800">{loan.amount}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Amount Paid</div>
                    <div className="font-medium text-gray-800">{loan.amountPaid}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Due Date</div>
                    <div className="font-medium text-gray-800">{loan.dueDate}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Next Payment</div>
                    <div className="font-medium text-gray-800">{loan.nextPayment}</div>
                </div>
            </div>

            {/* Replaced Progress component */}
            {(loan.status === 'active' || loan.status === 'completed') && loan.progress > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-600">Repayment Progress</span>
                        <span className="font-medium text-gray-700">{loan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${loan.progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                {/* Assuming text-muted-foreground maps to something like text-gray-500 */}
                <div className="text-xs text-gray-500">Applied on {loan.date}</div>

                {/* Replaced CustomButton with standard button */}
                <Link to={`/loans/${loan.id}`}>
                    <button
                        type="button"
                        // Approximating outline, sm variant styles
                        className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        View Details
                    </button>
                </Link>
            </div>
        </motion.div>
    );
};

// Removed type annotations from parameters
const filterLoans = (loans, status) => {
    if (!status || status === 'all') return loans;
    return loans.filter(loan => loan.status === status);
};

// Main Component
const MyLoans = () => {
    const [activeTab, setActiveTab] = useState('all'); // e.g., 'all', 'active', 'pending', etc.
    const filteredLoans = filterLoans(loans, activeTab);
    const tabOptions = ['all', 'active', 'pending', 'completed', 'rejected'];

    return (
        <>
            <div className="w-[95vw] mx-auto p-4 md:p-6"> {/* Added padding */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        {/* Heading animations */}
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900" // Ensure text color
                        >
                            My Loans
                        </motion.h1>
                        {/* Sub-heading animations */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-gray-500 mt-2" // text-muted-foreground replacement
                        >
                            View and manage all your loan applications and active loans
                        </motion.p>
                    </div>

                    {/* Replaced CustomButton with standard button */}
                    <Link to="/apply">
                        <button
                            type="button"
                            // Approximating primary variant styles
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-4 md:mt-0 whitespace-nowrap"
                        >
                            Apply for a New Loan
                        </button>
                    </Link>
                </div>

                {/* Replaced Tabs component */}
                <div className="mb-8">
                    {/* Approximating glass-card TabsList styling */}
                    <div className="flex space-x-1 rounded-lg bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg p-1 border border-gray-200 shadow-sm overflow-x-auto">
                        {tabOptions.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                // Conditional styling for active tab
                                className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow' // Active tab style
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800' // Inactive tab style
                                    }`}
                            >
                                {/* Capitalize first letter for display */}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} Loans
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loan Cards Grid or Empty State */}
                {filteredLoans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLoans.map((loan) => (
                            <LoanCard key={loan.id} loan={loan} />
                        ))}
                    </div>
                ) : (
                    // Empty state card
                    <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl p-12 text-center border border-gray-200 shadow-md">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium mb-2 text-gray-800">No loans found</h3>
                        <p className="text-gray-500 mb-6">
                            You don't have any {activeTab !== 'all' ? activeTab : ''} loans yet.
                        </p>
                        {/* Replaced CustomButton with standard button */}
                        <Link to="/apply">
                            <button
                                type="button"
                                // Approximating outline variant styles
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Apply for a Loan
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyLoans;