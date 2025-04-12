import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const Payments = () => {
    const [paymentData, setPaymentData] = useState([]);
    const customerId = JSON.parse(localStorage.getItem('user')).userId

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/customers/${customerId}/payments`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const formattedPayments = data.map(payment => ({
                    id: payment.transaction_id,
                    loan: payment.loan_name || `Loan ID: ${payment.loan_id}`,
                    amount: `₦${parseFloat(payment.amount_paid).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
                    date: new Date(payment.payment_date).toLocaleDateString(),
                    status: payment.status === 'completed' ? 'Completed' :
                        payment.status === 'pending' ? 'Pending' :
                            payment.status === 'failed' ? 'Failed' :
                                payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
                }));
                setPaymentData(formattedPayments);
            } catch (error) {
                console.error("Error fetching payment history:", error);
                setPaymentData([]);
            }
        };

        fetchPaymentHistory();
    }, [customerId]);

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

    // Helper function to render amount
    const renderAmount = (amount) => {
        return (
            <span className='flex items-center text-gray-900 font-medium'>
                {amount}
            </span>
        );
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen w-full">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Payment History</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
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
                                    Amount Paid
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Date
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
                                        {item.loan}
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