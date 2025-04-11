import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Toast from '../Toast'; 

const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

// Function to format currency (can be moved to helpers too)
const formatCurrency = (value, locale, currency) => {
    // Basic fallback if Intl fails or value is invalid
    if (value === null || value === undefined || value === '') return 'N/A';
    const numValue = Number(value);
    if (isNaN(numValue)) return 'N/A';

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0, // Adjust as needed
            maximumFractionDigits: 0,
        }).format(numValue);
    } catch (e) {
        console.error("Currency formatting error:", e);
        return `${currency} ${numValue}`; // Fallback
    }
};

// Function to format date (can be moved to helpers)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        // Adjust options as needed, e.g., 'en-GB' for DD/MM/YYYY
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return dateString; // Return original if formatting fails
    }
};

{/* Simple helper for display */ }
const displayValue = (value) => value || 'N/A';

const ReviewAndCompleteStep = ({ formData, currentStep, toast, product, setToast, currency, currencyLocale }) => {

    if (currentStep === 'review') {
        return (
            <motion.div key="review" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-gray-900">Review Application</h2>
                    <p className="text-sm text-gray-500">Please check all your information carefully before submitting.</p>
                </div>
                <div className="space-y-5 divide-y divide-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6">
                    {/* Personal Info Review Section */}
                    <div className="pt-0 sm:pt-0"> {/* Adjust padding */}
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Personal Information</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div className="sm:col-span-1"><dt className="text-gray-500">Name:</dt><dd className="text-gray-900 mt-0.5">{formData.firstName} {formData.lastName}</dd></div>
                            <div className="sm:col-span-1"><dt className="text-gray-500">Email:</dt><dd className="text-gray-900 mt-0.5 break-words">{formData.email}</dd></div>
                            <div className="sm:col-span-1"><dt className="text-gray-500">Phone:</dt><dd className="text-gray-900 mt-0.5">{formData.phone}</dd></div>
                            <div className="sm:col-span-2"><dt className="text-gray-500">Address:</dt><dd className="text-gray-900 mt-0.5">{formData.address}</dd></div>
                        </dl>
                    </div>
                    {/* Loan Details Review Section */}
                    <div className="pt-5">
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Loan Details</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div><dt className="text-gray-500">Amount:</dt><dd className="text-gray-900 font-semibold mt-0.5">{formatCurrency(formData.loanAmount, currencyLocale, currency)}</dd></div>
                            <div><dt className="text-gray-500">Purpose/Type:</dt><dd className="text-gray-900 mt-0.5">{formData.loanPurpose || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500">Term:</dt><dd className="text-gray-900 mt-0.5">{formData.loanTerm ? `${formData.loanTerm} months` : 'N/A'}</dd></div>
                        </dl>
                    </div>
                    {/* Employment Info Review Section */}
                    <div className="pt-5">
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Employment Information</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div><dt className="text-gray-500">Status:</dt><dd className="text-gray-900 mt-0.5">{displayValue(formData.employmentStatus)}</dd></div>
                            <div><dt className="text-gray-500">Employer/Business:</dt><dd className="text-gray-900 mt-0.5">{displayValue(formData.employer)}</dd></div>
                            <div><dt className="text-gray-500">Annual Income:</dt><dd className="text-gray-900 mt-0.5">{formatCurrency(formData.income, currencyLocale, currency)}</dd></div>
                            <div><dt className="text-gray-500">Start Date:</dt><dd className="text-gray-900 mt-0.5">{formatDate(formData.startDate)}</dd></div>
                        </dl>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (currentStep === 'complete') {
        return (
            <>
                <motion.div key="complete" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-8 text-center py-12">
                    {/* Toast notification display */}
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)} // Allow closing the toast
                        />
                    )}
                    {/* Success Icon Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className="mx-auto"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto ring-4 ring-green-50"> {/* Adjusted size/ring */}
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                    </motion.div>
                    {/* Confirmation Message */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Application Submitted!</h2>
                        <p className="text-gray-600 max-w-md mx-auto text-sm">
                            Thank you for applying{product ? ` for the ${product.product_name}` : ''}. We'll review your application and get back to you within 24-48 business hours.
                        </p>
                    </div>
                    {/* Application Summary (Optional) */}
                    <div className="pt-4">
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg max-w-xs mx-auto text-left">
                            <div className="text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Application Ref:</span>
                                    <span className="font-medium text-gray-700">{formData.application_reference}</span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Submitted Date:</span>
                                    <span className="font-medium text-gray-700">{new Date().toLocaleDateString('en-GB')}</span> 
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
        );
    }

    return null;
};

export default ReviewAndCompleteStep;