// LoanApplicationForm.jsx (using standard HTML and Tailwind without dark: - PURE JSX - Corrected)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Assuming CheckCircle is still needed


const LoanApplicationForm = () => {
    // CORRECTED THIS LINE: Removed <FormStep>
    const [currentStep, setCurrentStep] = useState('personal');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        loanAmount: 5000,
        loanPurpose: '',
        loanTerm: '',
        employmentStatus: '',
        employer: '',
        income: '',
        startDate: '',
    });
    // Removed useToast

    const handleInputChange = (e) => { // Updated type for select
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // No longer need separate select handler, handleInputChange covers it now

    const handleSliderChange = (e) => { // Updated handler for input type=range
        setFormData((prev) => ({ ...prev, loanAmount: parseInt(e.target.value, 10) }));
    };

    const handleNextStep = () => {
        if (currentStep === 'personal') setCurrentStep('loan');
        else if (currentStep === 'loan') setCurrentStep('employment');
        else if (currentStep === 'employment') setCurrentStep('review');
        else if (currentStep === 'review') {
            // Submit form logic would go here
            console.log("Submitting Form Data:", formData); // Log data for simulation
            setCurrentStep('complete');
            // Replaced toast with alert
            window.alert("Application submitted! Your loan application has been submitted successfully.");
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 'loan') setCurrentStep('personal');
        else if (currentStep === 'employment') setCurrentStep('loan');
        else if (currentStep === 'review') setCurrentStep('employment');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    // --- Progress Stepper Logic ---
    const stepsArray = ['personal', 'loan', 'employment', 'review'];
    const currentStepIndex = stepsArray.indexOf(currentStep);

    const getStepClass = (index) => {
        if (index === currentStepIndex) return 'bg-blue-600'; // Active step color (primary)
        if (index < currentStepIndex) return 'bg-green-500'; // Completed step color (accent)
        return 'bg-gray-300'; // Pending step color (secondary)
    };

    const getConnectorClass = (index) => {
        if (index < currentStepIndex) return 'bg-green-500'; // Completed connector color (accent)
        return 'bg-gray-300'; // Pending connector color (secondary)
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'personal':
                return (
                    <motion.div
                        key="personal" // Add key for AnimatePresence or motion stability
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Personal Information</h2>
                            <p className="text-gray-500">Please provide your personal details.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                {/* Replaced Label and Input */}
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" // Standard input style
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel" // Use tel type
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Home Address</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </motion.div>
                );

            case 'loan':
                return (
                    <motion.div
                        key="loan"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Loan Details</h2>
                            <p className="text-gray-500">Tell us about the loan you need.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                {/* Replaced Label and Slider */}
                                <label htmlFor="loanAmountSlider" className="block text-sm font-medium text-gray-700">Loan Amount: {formatCurrency(formData.loanAmount)}</label>
                                <input
                                    type="range"
                                    id="loanAmountSlider"
                                    name="loanAmount" // Can keep name for potential form submission logic
                                    value={formData.loanAmount}
                                    max={50000}
                                    min={1000}
                                    step={1000}
                                    onChange={handleSliderChange} // Use adapted handler
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" // Basic slider styling
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>$1,000</span>
                                    <span>$50,000</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {/* Replaced Label and Select */}
                                <label htmlFor="loanPurpose" className="block text-sm font-medium text-gray-700">Loan Purpose</label>
                                <select
                                    id="loanPurpose"
                                    name="loanPurpose"
                                    value={formData.loanPurpose}
                                    onChange={handleInputChange} // Use generic handler
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" // Standard select style
                                >
                                    <option value="" disabled>Select purpose</option>
                                    <option value="home-improvement">Home Improvement</option>
                                    <option value="debt-consolidation">Debt Consolidation</option>
                                    <option value="major-purchase">Major Purchase</option>
                                    <option value="education">Education</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">Loan Term</label>
                                <select
                                    id="loanTerm"
                                    name="loanTerm"
                                    value={formData.loanTerm}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="" disabled>Select term</option>
                                    <option value="12">12 months</option>
                                    <option value="24">24 months</option>
                                    <option value="36">36 months</option>
                                    <option value="48">48 months</option>
                                    <option value="60">60 months</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'employment':
                return (
                    <motion.div
                        key="employment"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Employment Information</h2>
                            <p className="text-gray-500">Please provide your employment details.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700">Employment Status</label>
                                <select
                                    id="employmentStatus"
                                    name="employmentStatus"
                                    value={formData.employmentStatus}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="" disabled>Select status</option>
                                    <option value="full-time">Full-Time</option>
                                    <option value="part-time">Part-Time</option>
                                    <option value="self-employed">Self-Employed</option>
                                    <option value="unemployed">Unemployed</option>
                                    <option value="retired">Retired</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="employer" className="block text-sm font-medium text-gray-700">Employer Name</label>
                                <input
                                    id="employer"
                                    name="employer"
                                    type="text"
                                    value={formData.employer}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="income" className="block text-sm font-medium text-gray-700">Annual Income</label>
                                <input
                                    id="income"
                                    name="income"
                                    type="number" // Use number type
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    placeholder="$"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Employment Start Date</label>
                                <input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </motion.div>
                );

            case 'review':
                return (
                    <motion.div
                        key="review"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Review Application</h2>
                            <p className="text-gray-500">Please review your information before submitting.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Replaced glass-card */}
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <h3 className="font-medium mb-3">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Name:</span>
                                        <p className="text-gray-800">{formData.firstName} {formData.lastName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Email:</span>
                                        <p className="text-gray-800">{formData.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Phone:</span>
                                        <p className="text-gray-800">{formData.phone}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Address:</span>
                                        <p className="text-gray-800">{formData.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <h3 className="font-medium mb-3">Loan Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Amount:</span>
                                        <p className="text-gray-800">{formatCurrency(formData.loanAmount)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Purpose:</span>
                                        <p className="text-gray-800">{formData.loanPurpose}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Term:</span>
                                        <p className="text-gray-800">{formData.loanTerm} months</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <h3 className="font-medium mb-3">Employment Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Status:</span>
                                        <p className="text-gray-800">{formData.employmentStatus}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Employer:</span>
                                        <p className="text-gray-800">{formData.employer}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Income:</span>
                                        <p className="text-gray-800">{formData.income ? `$${formData.income}` : 'N/A'}</p> {/* Added formatting for income */}
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Start Date:</span>
                                        <p className="text-gray-800">{formData.startDate || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'complete':
                return (
                    <motion.div
                        key="complete"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="space-y-8 text-center py-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="mx-auto"
                        >
                            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </motion.div>

                        <div className="space-y-3">
                            <h2 className="text-2xl font-semibold">Application Submitted!</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Thank you for submitting your loan application. We'll review it shortly and get back to you within 24-48 hours.
                            </p>
                        </div>

                        <div className="pt-6">
                            {/* Replaced glass-card */}
                            <div className="bg-white border border-gray-200 p-4 rounded-xl max-w-xs mx-auto">
                                <div className="text-sm">
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Application ID:</span>
                                        <span className="font-medium text-gray-800">BL-{Math.floor(100000 + Math.random() * 900000)}</span>
                                    </div>
                                    <hr className="border-gray-100" /> {/* Added separator */}
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Submitted:</span>
                                        <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        // Replaced glass-card container
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-lg">
            {/* Progress Stepper */}
            {currentStep !== 'complete' && (
                <div className="mb-8">
                    <div className="flex items-center mb-8"> {/* Simplified alignment */}
                        {stepsArray.map((step, index) => (
                            <React.Fragment key={step}>
                                {/* Step Indicator */}
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            backgroundColor: getStepClass(index).replace('bg-', ''), // Hacky way to extract color name, ideally use state mapping
                                            scale: currentStep === step ? 1.1 : 1,
                                        }}
                                        // Assign background color directly using inline style or use conditional classes
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${getStepClass(index)} transition-colors duration-300`}
                                    >
                                        {index + 1}
                                    </motion.div>
                                    <div className="text-xs mt-1 hidden sm:block capitalize text-gray-600">
                                        {step === 'loan' ? 'Loan Details' : step} {/* Format step name */}
                                    </div>
                                </div>

                                {/* Connector */}
                                {index < stepsArray.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${getConnectorClass(index)} transition-colors duration-300`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <hr className="border-gray-200" /> {/* Added separator */}
                </div>
            )}

            {/* Step Content Area */}
            <div className="mt-8">
                {renderStepContent()}
            </div>


            {/* Navigation Buttons */}
            {currentStep !== 'complete' && (
                <div className={`flex mt-10 ${currentStep === 'personal' ? 'justify-end' : 'justify-between'}`}> {/* Adjust alignment */}
                    {currentStep !== 'personal' && (
                        // Replaced CustomButton with standard button (outline variant)
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back
                        </button>
                    )}

                    {/* Replaced CustomButton with standard button (primary variant) */}
                    <button
                        type="button" // Change to type="submit" if this wraps a <form> element
                        onClick={handleNextStep}
                        className="px-4 py-2 border cursor-pointer border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {currentStep === 'review' ? 'Submit Application' : 'Continue'}
                    </button>
                </div>
            )}

            {/* Completion Button */}
            {currentStep === 'complete' && (
                <div className="mt-10 flex justify-center">
                    {/* Replaced CustomButton with standard button (outline variant) */}
                    <button
                        type="button"
                        // Use onClick for navigation or wrap in Link from react-router-dom
                        onClick={() => window.location.href = '/my-loans'} // Simple redirect
                        className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go to My Loans
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoanApplicationForm;