import React from 'react';
// Import icons from lucide-react
import { CheckCircle2, Clock, XCircle, TrendingUp, TrendingDown } from 'lucide-react'; // Added more icons for potential statuses

const Payments = () => {
    // Define the data for the payments/loans
    const paymentData = [
        { id: 1, loan: 'Home Renovation Loan', amount: '$540', date: 'May 15, 2023', status: 'Completed' },
        { id: 2, loan: 'Salary Deposit', amount: '$2,500', date: 'May 12, 2023', status: 'Completed' },
        { id: 3, loan: 'Education Loan Payment', amount: '$280', date: 'May 10, 2023', status: 'Completed' },
        { id: 4, loan: 'Car Loan Payment', amount: '$450', date: 'May 5, 2023', status: 'Completed' },
        { id: 5, loan: 'Utility Bill', amount: '$120', date: 'June 1, 2023', status: 'Pending' },
        { id: 6, loan: 'Consulting Fee', amount: '$1,200', date: 'June 3, 2023', status: 'Completed' },
        { id: 7, loan: 'Subscription Renewal', amount: '$50', date: 'June 5, 2023', status: 'Failed' },
    ];

    // Helper function to render status with appropriate icon and styling
    const renderStatus = (status) => {
        switch (status) {
            case 'Completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 size={14} className="mr-1" />
                        Completed
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={14} className="mr-1" />
                        Pending
                    </span>
                );
            case 'Failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle size={14} className="mr-1" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    // Helper function to render amount with type indicator
    const renderAmount = (amount) => {
        return (
            <span className='flex items-center text-red-600'>
                {amount}
            </span>
        );
    };


    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen w-full">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Payment History</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto"> {/* Makes table responsive on small screens */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paymentData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.loan} {/* Assuming 'loan' field is the description */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {renderAmount(item.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {renderStatus(item.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Optional: Add Pagination Controls Here */}
                {paymentData.length === 0 && (
                    <div className="text-center p-6 text-gray-500">
                        No payment history found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Payments;