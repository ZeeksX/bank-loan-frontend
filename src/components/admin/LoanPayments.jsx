import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Toast from '../Toast';

const LoanPayments = () => {
  const [paymentTransactions, setPaymentTransactions] = useState([]);
  const [toast, setToast] = useState({
    message: "",
    type: ""
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('https://bank-loan-backend-4cyr.onrender.com/api/payment_transactions', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPaymentTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setToast({ message: 'Failed to load payments', type: 'error' });
      }
    };
    fetchPayments();
  }, []);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reversed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Payment method icons/text
  const getPaymentMethod = (method) => {
    switch (method.toLowerCase()) {
      case 'online':
        return '🌐 Online';
      case 'bank_transfer':
        return '🏦 Bank Transfer';
      case 'cash':
        return '💵 Cash';
      case 'check':
        return '📄 Check';
      default:
        return '❓ Other';
    }
  };

  const handleConfirm = async (transactionId) => {
    try {
      const response = await fetch(`https://bank-loan-backend-4cyr.onrender.com/api/payment_transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          status: 'completed'
        })
      });

      if (response.ok) {
        setToast({ message: "Transaction confirmed successfully", type: 'success' });
        setPaymentTransactions(prev =>
          prev.map(t =>
            t.transaction_id === transactionId ? { ...t, status: 'completed' } : t
          )
        );
      } else {
        throw new Error("Failed to confirm transaction");
      }
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  const handleReject = async (transactionId) => {
    try {
      const response = await fetch(`https://bank-loan-backend-4cyr.onrender.com/api/payment_transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          status: 'failed'
        })
      });

      if (response.ok) {
        setToast({ message: "Transaction rejected", type: 'success' });
        setPaymentTransactions(prev =>
          prev.map(t =>
            t.transaction_id === transactionId ? { ...t, status: 'failed' } : t
          )
        );
      } else {
        throw new Error("Failed to reject transaction");
      }
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      <div className="space-y-4 inter p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loan Payments Management</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border bg-white rounded-lg shadow-sm mt-8"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">All Payments</h3>
          </div>
          <div className="p-4 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Loan ID</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Payment Date</th>
                    <th className="px-6 py-3">Method</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.transaction_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{transaction.transaction_id}
                      </td>
                      <td className="px-6 py-4">LOAN-{transaction.loan_id}</td>
                      <td className="px-6 py-4">
                        ₦{parseFloat(transaction.amount_paid).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(transaction.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {getPaymentMethod(transaction.payment_method)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {transaction.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleConfirm(transaction.transaction_id)}
                                className="cursor-pointer text-green-600 hover:text-green-800 text-xs p-1 font-medium">
                                Confirm
                              </button>
                              <button
                                onClick={() => handleReject(transaction.transaction_id)}
                                className="cursor-pointer text-red-600 hover:text-red-800 text-xs p-1 font-medium">
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {paymentTransactions.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border-b"
                    >
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No payment transactions found
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoanPayments;
