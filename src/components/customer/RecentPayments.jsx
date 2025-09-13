import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle } from 'lucide-react'; // Ensure these icons are imported

const RecentPayments = () => {
    const [paymentData, setPaymentData] = useState([]);
    const customerId = JSON.parse(localStorage.getItem('user'))?.userId;

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await fetch(`https://bank-loan-backend-4cyr.onrender.com/api/customers/${customerId}/payments`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
                });

                if (!response.ok) {
                    console.log(response)
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const sortedAndLimited = data
                    .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
                    .slice(0, 5);

                const formattedPayments = sortedAndLimited.map((payment, index) => ({
                    id: index,
                    loan: payment.loan_name || `Loan ID: ${payment.loan_id}`,
                    amount: `₦${parseFloat(payment.amount_paid).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })}`,
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
        if (customerId) fetchPaymentHistory();
    }, [customerId]);

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

    return (
        <div className="space-y-4">
            {paymentData.length > 0 ? (paymentData.map((payment, index) => (
                <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <div>
                        <div className="font-medium text-gray-900">{payment.loan}</div>
                        <div className="text-sm text-gray-500">{payment.date}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-medium text-gray-900">{payment.amount}</div>
                        <div className="text-sm">{renderStatus(payment.status)}</div>
                    </div>
                </motion.div>
            ))) : (
                <div>No recent payment </div>
            )}
        </div>
    );
};

export default RecentPayments;
