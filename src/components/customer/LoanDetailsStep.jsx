import React from 'react';
import { motion } from 'framer-motion';
import { renderSelect } from './FormHelpers'; 
// If renderInput is also needed, import it too.

const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

// Function to format currency (can be moved to helpers too)
const formatCurrency = (value, locale, currency) => {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0, // Adjust as needed
            maximumFractionDigits: 0,
        }).format(value);
    } catch (e) {
        console.error("Currency formatting error:", e);
        return `${currency} ${value}`; // Fallback
    }
};


const LoanDetailsStep = ({
    formData,
    errors,
    handleInputChange,
    handleSliderChange,
    minAmount,
    maxAmount,
    termOptions,
    currency,
    currencyLocale
}) => {
    const amountDisplay = formatCurrency(formData.loanAmount, currencyLocale, currency);
    const minAmountDisplay = formatCurrency(minAmount, currencyLocale, currency);
    const maxAmountDisplay = formatCurrency(maxAmount, currencyLocale, currency);

    return (
        <motion.div key="loan" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl text-center font-semibold text-gray-900">Loan Details</h2>
                {errors.form && <p className="text-red-600 text-sm font-medium mt-2">{errors.form}</p>}
            </div>
            <div className="space-y-5"> {/* Adjusted spacing */}
                {/* Loan Type (Display Only - assuming purpose doesn't change here) */}
                <div className="space-y-1.5 mb-16">
                    <label htmlFor="loanPurposeDisplay" className="flex gap-2 items-center text-lg font-medium text-gray-700">
                        Loan Type: <span id="loanPurposeDisplay" className='font-semibold text-lg text-gray-900'>{formData.loanPurpose}</span>
                    </label>
                </div>

                {/* Loan Amount Slider */}
                <div className="space-y-1.5 mb-16">
                    <label htmlFor="loanAmountSlider" className="flex gap-2 items-center text-lg font-medium text-gray-700">
                        Loan Amount: <span className='font-semibold text-lg text-gray-900'>{amountDisplay}</span>
                    </label>
                    <input
                        type="range"
                        id="loanAmountSlider"
                        name="loanAmount"
                        value={formData.loanAmount}
                        min={minAmount} // Use derived min value
                        max={maxAmount} // Use derived max value
                        step={Math.max(1000, Math.round((maxAmount - minAmount) / 100))} // Dynamic step
                        onChange={handleSliderChange}
                        aria-describedby={errors.loanAmount ? `loanAmountSlider-error` : undefined}
                        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 ${errors.loanAmount ? 'ring-2 ring-offset-1 ring-red-500' : ''}`}
                    />
                    <div className="flex justify-between text-xs text-gray-500 px-1">
                        <span>{minAmountDisplay}</span>
                        <span>{maxAmountDisplay}</span>
                    </div>
                    {errors.loanAmount && <p id="loanAmountSlider-error" className="text-red-600 text-xs mt-1">{errors.loanAmount}</p>}
                </div>

                {/* Loan Term Selection */}
                {renderSelect(
                    'loanTerm',
                    'loanTerm',
                    'Loan Term',
                    formData,
                    handleInputChange,
                    errors,
                    termOptions, // Use dynamically generated term options
                    { placeholder: "Select desired term" }
                )}
            </div>
        </motion.div>
    );
};

export default LoanDetailsStep;