import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock, DollarSign, Calendar, CreditCard } from 'lucide-react';

const LoanInformation = () => {
    const { id } = useParams();
    const location = useLocation();
    const loan = location.state || {};
    console.log(loan)

    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Extract numeric value from formatted money string (e.g., "₦150,000" -> 150000)
    const extractAmount = (formattedAmount) => {
        if (!formattedAmount || formattedAmount === 'N/A') return 0;
        return parseFloat(formattedAmount.replace(/[^\d.]/g, ''));
    };

    // Calculate remaining balance
    const calculateRemainingBalance = () => {
        const totalAmount = extractAmount(loan.amount);
        const amountPaid = extractAmount(loan.amountPaid);
        return totalAmount - amountPaid;
    };

    const remainingBalance = calculateRemainingBalance();
    const nextPaymentAmount = extractAmount(loan.nextPayment);

    // Handle payment submission
    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);

            // Reset success message after 3 seconds
            setTimeout(() => {
                setPaymentSuccess(false);
            }, 3000);
        }, 1500);
    };

    // Get status icon based on loan status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
            case 'completed':
            case 'active':
            case 'paid':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'submitted':
            case 'under_review':
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
    };

    // Get status text with proper formatting
    const getStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'active':
                return 'Active';
            case 'completed':
            case 'paid':
                return 'Paid';
            case 'submitted':
                return 'Submitted';
            case 'under_review':
            case 'pending':
                return 'Pending Review';
            case 'rejected':
                return 'Rejected';
            case 'defaulted':
                return 'Defaulted';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    // Format number as currency
    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString()}`;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/my-loans" className="text-blue-600 hover:text-blue-800 flex items-center">
                    ← Back to Loans
                </Link>
            </div>

            <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl p-8 border border-gray-200 shadow-lg">
                {/* Loan Header */}
                <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-6">
                    <div>
                        <div className="flex items-center">
                            <div className="mr-2">{getStatusIcon(loan.status)}</div>
                            <span className="text-sm font-medium text-gray-500">{getStatusText(loan.status)}</span>
                        </div>
                        <h1 className="text-2xl font-semibold mt-2 text-gray-900">{loan.name}</h1>
                        <p className="text-sm text-gray-500 mt-1">Loan ID: {loan.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Applied on</p>
                        <p className="text-gray-800 font-medium">{loan.start_date}</p>
                    </div>
                </div>

                {/* Loan Details */}
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                        <div className="text-sm text-gray-500">Loan Amount</div>
                        <div className="font-medium text-xl text-gray-800">{loan.amount}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Amount Paid</div>
                        <div className="font-medium text-xl text-gray-800">{loan.amountPaid || '₦0'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Remaining Balance</div>
                        <div className="font-medium text-xl text-gray-800">{formatCurrency(remainingBalance)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Due Date</div>
                        <div className="font-medium text-gray-800">{loan.dueDate || 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Next Payment</div>
                        <div className="font-medium text-gray-800">{loan.nextPayment || 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Payment Due</div>
                        <div className="font-medium text-gray-800">{loan.status === 'active' ? '30 days' : 'N/A'}</div>
                    </div>
                </div>

                {/* Repayment Progress */}
                {(loan.status === 'approved' || loan.status === 'active' || loan.status === 'completed') && (loan.progress > 0) && (
                    <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium mb-4 text-gray-900">Repayment Progress</h3>
                        <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-600">Total Progress</span>
                            <span className="font-medium text-gray-700">{loan.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${loan.progress}%` }}
                            ></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                            <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Total: {loan.amount}</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                <span>Paid: {loan.amountPaid}</span>
                            </div>
                            <div className="flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                                <span>Remaining: {formatCurrency(remainingBalance)}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Due by: {loan.dueDate}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Section - Only show if loan is active */}
                {loan.status === 'active' && (
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium mb-4 text-gray-900">Make a Payment</h3>

                        {paymentSuccess ? (
                            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4">
                                Payment successful! Your loan balance has been updated.
                            </div>
                        ) : null}

                        <form onSubmit={handlePaymentSubmit}>
                            <div className="grid md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Amount
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">₦</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder={nextPaymentAmount.toString()}
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentAmount(nextPaymentAmount.toString())}
                                                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
                                            >
                                                Next Due
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="online">Online Payment</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="cash">Cash</option>
                                        <option value="check">Check</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md mb-4">
                                <h4 className="font-medium text-sm text-gray-700 mb-2">Payment Summary</h4>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Payment Amount:</span>
                                    <span className="font-medium">{formatCurrency(parseFloat(paymentAmount || nextPaymentAmount))}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Payment Method:</span>
                                    <span className="font-medium">{paymentMethod.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                                    <span className="text-gray-700">New Balance After Payment:</span>
                                    <span className="font-medium">
                                        {formatCurrency(Math.max(0, remainingBalance - parseFloat(paymentAmount || nextPaymentAmount)))}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex items-center justify-center w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Make Payment
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Payment History - Placeholder */}
                <div className="border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
                    </div>

                    {loan.progress > 0 ? (
                        <div className="divide-y divide-gray-200">
                            <div className="px-6 py-4 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">Payment #{loan.progress > 50 ? 2 : 1}</p>
                                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-800">{loan.amountPaid}</p>
                                    <p className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full inline-block">Completed</p>
                                </div>
                            </div>

                            {loan.progress > 50 && (
                                <div className="px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">Payment #1</p>
                                        <p className="text-sm text-gray-500">{new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-800">{loan.nextPayment}</p>
                                        <p className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full inline-block">Completed</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No payments recorded yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanInformation;