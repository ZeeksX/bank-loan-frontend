import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LoanCard = ({ loan, myLoan, getStatusIcon, getStatusText }) => {
    const combinedLoanData = {
        ...loan,
        ...myLoan,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
            className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-200 shadow-md"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center">
                        <div className="mr-2">{getStatusIcon(combinedLoanData.status || loan.status)}</div>
                        <span className="text-sm font-medium text-gray-500">{getStatusText(combinedLoanData.status || loan.status)}</span>
                    </div>
                    <h3 className="text-lg font-medium mt-2 text-gray-900">{combinedLoanData.name || loan.name}</h3>
                </div>
                <div className="text-sm text-right">
                    <div className="text-gray-500">Loan ID</div>
                    <div className="text-gray-800">{combinedLoanData.id || loan.id}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <div className="text-sm text-gray-500">Loan Amount</div>
                    <div className="font-medium text-gray-800">{combinedLoanData.amount || loan.amount}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Amount Paid</div>
                    <div className="font-medium text-gray-800">{combinedLoanData.amountPaid || 'N/A'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Due Date</div>
                    <div className="font-medium text-gray-800">{combinedLoanData.dueDate || loan.dueDate || 'N/A'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Next Payment</div>
                    <div className="font-medium text-gray-800">{combinedLoanData.nextPayment || 'N/A'}</div>
                </div>
            </div>

            {(combinedLoanData.status === 'active' || combinedLoanData.status === 'completed' || loan.status === 'active' || loan.status === 'completed') && (combinedLoanData.progress > 0 || loan.progress > 0) && (
                <div className="mb-6">
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-600">Repayment Progress</span>
                        <span className="font-medium text-gray-700">{combinedLoanData.progress || loan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${combinedLoanData.progress || loan.progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-500">Applied on {combinedLoanData.start_date || loan.start_date}</div>
                <Link to={`/loans/${combinedLoanData.id || loan.id}`}>
                    <button
                        type="button"
                        className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        View Details
                    </button>
                </Link>
            </div>
        </motion.div>
    );
};

export default LoanCard;