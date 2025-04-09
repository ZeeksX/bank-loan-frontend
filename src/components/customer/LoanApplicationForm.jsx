// LoanApplicationForm.jsx (using standard HTML and Tailwind - PURE JSX - With Validation)
import React, { useState, useCallback } from 'react'; // Added useCallback
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import * as Yup from 'yup'; // Import Yup
import Toast from '../Toast';
// --- Validation Schemas ---
// Define validation rules for each step

const personalSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First name is required'),
    lastName: Yup.string().trim().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    // Basic phone validation (can be made stricter with regex if needed)
    phone: Yup.string().trim().required('Phone number is required').matches(/^[0-9+\-() ]+$/, 'Invalid phone number format'),
    address: Yup.string().trim().required('Address is required'),
});

const loanSchema = Yup.object().shape({
    loanAmount: Yup.number()
        .min(1000, 'Minimum loan amount is $1,000')
        .max(50000, 'Maximum loan amount is $50,000')
        .required('Loan amount is required'), // Should always have a value due to slider
    loanPurpose: Yup.string().required('Please select a loan purpose'),
    loanTerm: Yup.string().required('Please select a loan term'),
});

const employmentSchema = Yup.object().shape({
    employmentStatus: Yup.string().required('Please select an employment status'),
    // Employer is required only if employed or self-employed
    employer: Yup.string().when('employmentStatus', {
        is: (status) => ['full-time', 'part-time', 'self-employed'].includes(status),
        then: (schema) => schema.trim().required('Employer name is required'),
        otherwise: (schema) => schema.optional(), // Not required otherwise
    }),
    // Income is required and must be positive only if employed or self-employed
    income: Yup.number().when('employmentStatus', {
        is: (status) => ['full-time', 'part-time', 'self-employed'].includes(status),
        then: (schema) => schema.positive('Income must be positive').required('Annual income is required').typeError('Income must be a number'),
        otherwise: (schema) => schema.optional().nullable(), // Allow empty/null otherwise
    }),
    // Start date is required only if employed or self-employed
    startDate: Yup.date().when('employmentStatus', {
        is: (status) => ['full-time', 'part-time', 'self-employed'].includes(status),
        then: (schema) => schema.required('Employment start date is required').typeError('Invalid date format'),
        otherwise: (schema) => schema.optional().nullable(),
    }),
});
// --- End Validation Schemas ---


const LoanApplicationForm = () => {
    const [currentStep, setCurrentStep] = useState('personal'); // Keep step types as strings
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
        income: '', // Keep as string initially for input, Yup will cast
        startDate: '', // Keep as string initially for input
    });
    const [errors, setErrors] = useState({}); // State to hold validation errors
    const [toast, setToast] = useState(null); // State for toast notifications

    // --- Input Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear the error for this field when the user types
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setFormData((prev) => ({ ...prev, loanAmount: value }));
        if (errors.loanAmount) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.loanAmount;
                return newErrors;
            });
        }
    };

    // --- Validation Logic ---
    const validateStep = useCallback(async () => {
        let schema;
        let dataToValidate = {};

        // Select the correct schema and data subset for the current step
        if (currentStep === 'personal') {
            schema = personalSchema;
            dataToValidate = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
            };
        } else if (currentStep === 'loan') {
            schema = loanSchema;
            dataToValidate = {
                loanAmount: formData.loanAmount,
                loanPurpose: formData.loanPurpose,
                loanTerm: formData.loanTerm,
            };
        } else if (currentStep === 'employment') {
            schema = employmentSchema;
            dataToValidate = {
                employmentStatus: formData.employmentStatus,
                employer: formData.employer,
                income: formData.income === '' ? null : formData.income, // Handle empty string for optional number
                startDate: formData.startDate === '' ? null : formData.startDate, // Handle empty string for optional date
            };
        } else {
            return true; // No validation needed for review or complete steps here
        }

        try {
            // Validate the data subset
            await schema.validate(dataToValidate, { abortEarly: false }); // Validate all fields
            setErrors({}); // Clear errors if validation is successful
            return true; // Indicate success
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                // Transform Yup errors into a more usable format { fieldName: errorMessage }
                const formattedErrors = {};
                err.inner.forEach(error => {
                    if (error.path && !formattedErrors[error.path]) { // Take the first error per field
                        formattedErrors[error.path] = error.message;
                    }
                });
                setErrors(formattedErrors);
            } else {
                console.error("Unexpected validation error:", err); // Log other errors
                setErrors({ form: 'An unexpected error occurred during validation.' });
            }
            return false; // Indicate failure
        }
    }, [currentStep, formData]); // Dependencies for useCallback

    // --- Step Navigation ---
    const handleNextStep = async () => { // Make async to await validation
        const isValid = await validateStep(); // Validate before proceeding

        if (!isValid) {
            return; // Stop if validation fails
        }

        // Proceed if validation passed
        if (currentStep === 'personal') setCurrentStep('loan');
        else if (currentStep === 'loan') setCurrentStep('employment');
        else if (currentStep === 'employment') setCurrentStep('review');
        else if (currentStep === 'review') {
            // Submit form logic would go here (already validated up to this point)
            console.log("Submitting Form Data:", formData);
            setCurrentStep('complete');
            // Show success toast
            setToast({
                message: 'Application submitted! Your loan application has been submitted successfully',
                type: 'success'
            });
        }
    };

    const handlePrevStep = () => {
        setErrors({}); // Clear errors when going back
        if (currentStep === 'loan') setCurrentStep('personal');
        else if (currentStep === 'employment') setCurrentStep('loan');
        else if (currentStep === 'review') setCurrentStep('employment');
    };

    // --- Formatting ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // --- Animation Variants ---
    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    // --- Progress Stepper Logic ---
    const stepsArray = ['personal', 'loan', 'employment', 'review'];
    const currentStepIndex = stepsArray.indexOf(currentStep);

    const getStepClass = (index) => {
        if (index === currentStepIndex) return 'bg-blue-600';
        if (index < currentStepIndex) return 'bg-green-500';
        return 'bg-gray-300';
    };

    const getConnectorClass = (index) => {
        if (index < currentStepIndex) return 'bg-green-500';
        return 'bg-gray-300';
    };

    // --- Helper to render input with error ---
    // This makes the JSX cleaner
    const renderInput = (id, name, label, type = 'text', props = {}) => (
        <div className="space-y-1"> {/* Reduced space for error */}
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                {...props} // Spread additional props like placeholder
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    const renderSelect = (id, name, label, options, props = {}) => (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                id={id}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white`}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    // --- Render Step Content ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 'personal':
                return (
                    <motion.div
                        key="personal"
                        variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Personal Information</h2>
                            <p className="text-gray-500">Please provide your personal details.</p>
                            {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>} {/* General form error */}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> {/* Adjusted gap */}
                            {renderInput('firstName', 'firstName', 'First Name')}
                            {renderInput('lastName', 'lastName', 'Last Name')}
                            {renderInput('email', 'email', 'Email Address', 'email')}
                            {renderInput('phone', 'phone', 'Phone Number', 'tel')}
                            <div className="md:col-span-2">
                                {renderInput('address', 'address', 'Home Address')}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'loan':
                return (
                    <motion.div
                        key="loan"
                        variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Loan Details</h2>
                            <p className="text-gray-500">Tell us about the loan you need.</p>
                            {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
                        </div>
                        <div className="space-y-6"> {/* Adjusted spacing */}
                            <div className="space-y-2"> {/* Reduced space for error */}
                                <label htmlFor="loanAmountSlider" className="block text-sm font-medium text-gray-700">Loan Amount: {formatCurrency(formData.loanAmount)}</label>
                                <input
                                    type="range"
                                    id="loanAmountSlider"
                                    name="loanAmount"
                                    value={formData.loanAmount}
                                    max={50000}
                                    min={1000}
                                    step={1000}
                                    onChange={handleSliderChange}
                                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 ${errors.loanAmount ? 'border border-red-500 ring-1 ring-red-500' : ''}`} // Add error styling hint
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>$1,000</span>
                                    <span>$50,000</span>
                                </div>
                                {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
                            </div>

                            {renderSelect('loanPurpose', 'loanPurpose', 'Loan Purpose', [
                                { value: "", label: "Select purpose", disabled: true },
                                { value: "home-improvement", label: "Home Improvement" },
                                { value: "debt-consolidation", label: "Debt Consolidation" },
                                { value: "major-purchase", label: "Major Purchase" },
                                { value: "education", label: "Education" },
                                { value: "other", label: "Other" },
                            ])}

                            {renderSelect('loanTerm', 'loanTerm', 'Loan Term', [
                                { value: "", label: "Select term", disabled: true },
                                { value: "12", label: "12 months" },
                                { value: "24", label: "24 months" },
                                { value: "36", label: "36 months" },
                                { value: "48", label: "48 months" },
                                { value: "60", label: "60 months" },
                            ])}
                        </div>
                    </motion.div>
                );

            case 'employment':
                return (
                    <motion.div
                        key="employment"
                        variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Employment Information</h2>
                            <p className="text-gray-500">Please provide your employment details.</p>
                            {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
                        </div>
                        <div className="space-y-4"> {/* Adjusted spacing */}
                            {renderSelect('employmentStatus', 'employmentStatus', 'Employment Status', [
                                { value: "", label: "Select status", disabled: true },
                                { value: "full-time", label: "Full-Time" },
                                { value: "part-time", label: "Part-Time" },
                                { value: "self-employed", label: "Self-Employed" },
                                { value: "unemployed", label: "Unemployed" },
                                { value: "retired", label: "Retired" },
                            ])}

                            {/* Conditionally render based on status if needed, but validation handles requirement */}
                            {renderInput('employer', 'employer', 'Employer Name')}

                            {renderInput('income', 'income', 'Annual Income', 'number', { placeholder: '$' })}

                            {renderInput('startDate', 'startDate', 'Employment Start Date', 'date')}
                        </div>
                    </motion.div>
                );

            case 'review':
                // (Review step remains largely the same, just displays data)
                return (
                    <motion.div
                        key="review"
                        variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Review Application</h2>
                            <p className="text-gray-500">Please review your information before submitting.</p>
                        </div>
                        <div className="space-y-6">
                            {/* Personal Info Review */}
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <h3 className="font-medium mb-3">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">Name:</span><p className="text-gray-800">{formData.firstName} {formData.lastName}</p></div>
                                    <div><span className="text-gray-500">Email:</span><p className="text-gray-800">{formData.email}</p></div>
                                    <div><span className="text-gray-500">Phone:</span><p className="text-gray-800">{formData.phone}</p></div>
                                    <div><span className="text-gray-500">Address:</span><p className="text-gray-800">{formData.address}</p></div>
                                </div>
                            </div>
                            {/* Loan Details Review */}
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <h3 className="font-medium mb-3">Loan Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">Amount:</span><p className="text-gray-800">{formatCurrency(formData.loanAmount)}</p></div>
                                    <div><span className="text-gray-500">Purpose:</span><p className="text-gray-800">{formData.loanPurpose || 'N/A'}</p></div>
                                    <div><span className="text-gray-500">Term:</span><p className="text-gray-800">{formData.loanTerm ? `${formData.loanTerm} months` : 'N/A'}</p></div>
                                </div>
                            </div>
                            {/* Employment Info Review */}
                            <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                <h3 className="font-medium mb-3">Employment Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">Status:</span><p className="text-gray-800">{formData.employmentStatus || 'N/A'}</p></div>
                                    <div><span className="text-gray-500">Employer:</span><p className="text-gray-800">{formData.employer || 'N/A'}</p></div>
                                    <div><span className="text-gray-500">Income:</span><p className="text-gray-800">{formData.income ? `$${Number(formData.income).toLocaleString()}` : 'N/A'}</p></div>
                                    <div><span className="text-gray-500">Start Date:</span><p className="text-gray-800">{formData.startDate || 'N/A'}</p></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'complete':
                // (Complete step remains the same)
                return (
                    <>

                        <motion.div
                            key="complete"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.4 }}
                            className="space-y-8 text-center py-12"
                        >
                            {toast && (
                                <Toast
                                    message={toast.message}
                                    type={toast.type}
                                    onClose={() => setToast(null)}
                                />
                            )}
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
                                <div className="bg-white border border-gray-200 p-4 rounded-xl max-w-xs mx-auto">
                                    <div className="text-sm">
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-500">Application ID:</span>
                                            <span className="font-medium text-gray-800">BL-{Math.floor(100000 + Math.random() * 900000)}</span>
                                        </div>
                                        <hr className="border-gray-100" />
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-500">Submitted:</span>
                                            <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>

                );
            default:
                return null;
        }
    };

    // --- Main Return ---
    return (
        <div className="bg-white inter border border-gray-200 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-lg">
            {/* Progress Stepper */}
            {currentStep !== 'complete' && (
                <div className="mb-8">
                    <div className="flex items-center mb-8">
                        {stepsArray.map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            // Simple scale animation for active step
                                            scale: index === currentStepIndex ? 1.1 : 1,
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${getStepClass(index)} transition-colors duration-300`}
                                    >
                                        {index + 1}
                                    </motion.div>
                                    <div className="text-xs mt-1 hidden sm:block capitalize text-gray-600">
                                        {step.replace('-', ' ')} {/* Simple formatting */}
                                    </div>
                                </div>
                                {index < stepsArray.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${getConnectorClass(index)} transition-colors duration-300`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <hr className="border-gray-200" />
                </div>
            )}

            {/* Step Content Area */}
            <div className="mt-8">
                {/* Using AnimatePresence might be smoother for transitions if steps unmount/remount */}
                {/* <AnimatePresence mode="wait"> */}
                {renderStepContent()}
                {/* </AnimatePresence> */}
            </div>

            {/* Navigation Buttons */}
            {currentStep !== 'complete' && (
                <div className={`flex mt-10 ${currentStep === 'personal' ? 'justify-end' : 'justify-between'}`}>
                    {currentStep !== 'personal' && (
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back
                        </button>
                    )}
                    <button
                        type="button"
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
                    <button
                        type="button"
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