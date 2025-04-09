import React from 'react'
import { motion } from 'framer-motion';

const RecentPayments = () => {

    const recentPayments = [
        { id: 1, loan: 'Home Renovation Loan', amount: '$540', date: 'May 15, 2023', status: 'Completed' },
        { id: 2, loan: 'Education Loan', amount: '$280', date: 'May 10, 2023', status: 'Completed' },
        { id: 3, loan: 'Car Loan', amount: '$450', date: 'May 5, 2023', status: 'Completed' },
    ];

    return (
        <>
            <div className="space-y-4">
                {recentPayments.map((payment) => (
                    <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: payment.id * 0.1 }}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div>
                            <div className="font-medium text-gray-900">{payment.loan}</div>
                            <div className="text-sm text-gray-500">{payment.date}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium text-gray-900">{payment.amount}</div>
                            <div className="text-sm text-green-500">{payment.status}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    )
}

export default RecentPayments