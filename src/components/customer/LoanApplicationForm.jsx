import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import * as Yup from 'yup';
import Toast from '../Toast'; // Assuming Toast component path is correct

// --- Static Schemas (Can stay outside component) ---
const personalSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First name is required'),
    lastName: Yup.string().trim().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().trim().required('Phone number is required').matches(/^[0-9+\-() ]+$/, 'Invalid phone number format'),
    address: Yup.string().trim().required('Address is required'),
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
// --- End Static Schemas ---

// --- Default values (used if no product is passed) ---
const DEFAULT_MIN_AMOUNT = 100000; // Example default Naira (₦100,000)
const DEFAULT_MAX_AMOUNT = 5000000; // Example default Naira (₦5,000,000)
const DEFAULT_MIN_TERM = 6; // Example default 6 months
const DEFAULT_MAX_TERM = 60; // Example default 60 months
const DEFAULT_CURRENCY = 'NGN'; // Nigerian Naira
const DEFAULT_CURRENCY_LOCALE = 'en-NG'; // Nigeria Locale


const LoanApplicationForm = ({ product }) => {
    // --- Determine Loan Constraints from product or defaults ---
    // These values are stable for the lifetime of the component instance given a product prop
    const minAmount = product?.min_amount ?? DEFAULT_MIN_AMOUNT;
    const maxAmount = product?.max_amount ?? DEFAULT_MAX_AMOUNT;
    const minTerm = product?.min_term ?? DEFAULT_MIN_TERM;
    const maxTerm = product?.max_term ?? DEFAULT_MAX_TERM;
    const currency = product?.currency ?? DEFAULT_CURRENCY;
    const currencyLocale = product?.locale ?? DEFAULT_CURRENCY_LOCALE;

    // --- Formatting Helper (Memoized with useCallback) ---
    // Defined early so it can be used in useMemo for the schema
    const formatCurrency = useCallback((amount, curr = currency, loc = currencyLocale) => {
        // Basic handling for non-numeric values during initial render or state updates
        // Use Intl.NumberFormat for proper currency formatting
        return new Intl.NumberFormat(loc, {
            style: 'currency',
            currency: curr,
            minimumFractionDigits: 0, // Typically no kobo for Naira display
            maximumFractionDigits: 0,
        }).format(amount);
    }, [currency, currencyLocale]); // Recalculate only if currency settings change


    // --- State Definitions ---
    const [currentStep, setCurrentStep] = useState('personal');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        // Initialize form state using the determined constraints
        loanAmount: minAmount, // Start slider/amount at the minimum allowed
        loanPurpose: product?.product_name ?? '', // Pre-fill purpose if product exists
        loanTerm: minTerm.toString(), // Start term select at the minimum allowed
        employmentStatus: '',
        employer: '',
        income: '', // Input type="number" will handle string<->number, Yup validates number
        startDate: '', // Input type="date" provides string, Yup validates date
    });
    const [errors, setErrors] = useState({}); // State to hold validation errors
    const [toast, setToast] = useState(null); // State for toast notifications

    // --- Dynamic Loan Schema (Memoized with useMemo) ---
    // This schema is specific to the loan step and depends on product limits
    const loanSchema = useMemo(() => {
        console.log(`DEBUG: Creating loan schema with minAmount: ${minAmount}, maxAmount: ${maxAmount}, minTerm: ${minTerm}, maxTerm: ${maxTerm}`);
        return Yup.object().shape({
            loanAmount: Yup.number()
                .min(minAmount, `Minimum loan amount is ${formatCurrency(minAmount)}`) // Use derived minAmount
                .max(maxAmount, `Maximum loan amount is ${formatCurrency(maxAmount)}`) // Use derived maxAmount
                .required('Loan amount is required')
                .typeError('Loan amount must be a valid number'), // Add type error message
            loanPurpose: Yup.string()
                .required('Loan purpose is required'), // Basic check, as it's pre-filled
            loanTerm: Yup.number() // Validate term as a number
                .min(minTerm, `Minimum term is ${minTerm} months`) // Use derived minTerm
                .max(maxTerm, `Maximum term is ${maxTerm} months`) // Use derived maxTerm
                .required('Please select a loan term')
                .typeError('Loan term must be selected'), // Error if parsing fails
        });
        // Regenerate schema only if the limits or formatting function change
    }, [minAmount, maxAmount, minTerm, maxTerm, formatCurrency]);


    // --- Effect to sync formData after initial product load (Optional Refinement) ---
    // Useful if product might load slightly after initial render, ensures defaults match product
    useEffect(() => {
        if (product) {
            // Check if form fields are still at their initial *default* state or inconsistent
            // This avoids overwriting user changes if they navigate back and forth
            const needsSync =
                formData.loanAmount === DEFAULT_MIN_AMOUNT ||
                formData.loanTerm === DEFAULT_MIN_TERM.toString() ||
                formData.loanPurpose === '';

            if (needsSync) {
                console.log("DEBUG: Product prop available, syncing initial form fields...");
                setFormData(prev => ({
                    ...prev,
                    loanAmount: minAmount, // Ensure amount starts at product min
                    loanPurpose: product.product_name || '', // Ensure purpose matches product
                    loanTerm: minTerm.toString(), // Ensure term starts at product min
                }));
            }
        }
        // Run this effect when the product prop itself changes (usually only on initial load)
        // also include the derived limits in deps to be safe if they drive initialization logic
    }, [product, minAmount, minTerm]);


    // --- Generate Term Options (Memoized with useMemo) ---
    // Creates the array of term options based on product limits
    const termOptions = useMemo(() => {
        const options = [];
        const start = Number(minTerm);
        const end = Number(maxTerm);

        // Check if terms are valid numbers
        if (!isNaN(start) && !isNaN(end) && start <= end) {
            // Create an option for each month within the range
            for (let t = start; t <= end; t++) {
                options.push({ value: t.toString(), label: `${t} months` });
            }
            return options; // Return the generated list
        }

        // Fallback if product terms are missing or invalid
        console.warn("Product term limits invalid or missing. Using fallback term options.");
        return [
            { value: "12", label: "12 months" }, { value: "24", label: "24 months" },
            { value: "36", label: "36 months" }, { value: "48", label: "48 months" },
            { value: "60", label: "60 months" },
        ];
    }, [minTerm, maxTerm]); // Recalculate only if term limits change


    // --- Input Handlers (Memoized with useCallback) ---
    // Handles changes for standard input and select fields
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear the specific error message when the user starts typing/selecting
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [errors]); // Dependency: errors state (to allow clearing)

    // Handles changes for the loan amount range slider
    const handleSliderChange = useCallback((e) => {
        const value = parseInt(e.target.value, 10);
        setFormData(prev => ({ ...prev, loanAmount: value }));
        // Clear loanAmount error specifically when slider moves
        if (errors.loanAmount) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.loanAmount;
                return newErrors;
            });
        }
    }, [errors]); // Dependency: errors state


    // --- Validation Logic (Memoized with useCallback) ---
    // Validates the current step's data against its corresponding schema
    const validateStep = useCallback(async () => {
        let schema;
        let dataToValidate = {};
        // Use a snapshot of formData for this validation attempt
        const currentData = { ...formData };

        console.log(`DEBUG: Validating step: ${currentStep}`);

        // Select the appropriate schema and data subset for the current step
        if (currentStep === 'personal') {
            schema = personalSchema;
            dataToValidate = {
                firstName: currentData.firstName, lastName: currentData.lastName, email: currentData.email,
                phone: currentData.phone, address: currentData.address,
            };
        } else if (currentStep === 'loan') {
            schema = loanSchema; // Use the dynamic loan schema
            dataToValidate = {
                loanAmount: currentData.loanAmount,
                loanPurpose: currentData.loanPurpose,
                // Convert loanTerm string from state to number for validation
                loanTerm: parseInt(currentData.loanTerm, 10) || null, // Use null if empty or NaN
            };
        } else if (currentStep === 'employment') {
            schema = employmentSchema;
            dataToValidate = {
                employmentStatus: currentData.employmentStatus, employer: currentData.employer,
                // Handle empty strings for optional number/date fields before validation
                income: currentData.income === '' ? null : currentData.income,
                startDate: currentData.startDate === '' ? null : currentData.startDate,
            };
        } else {
            return true; // No validation needed for 'review' or 'complete' steps here
        }

        try {
            console.log("DEBUG: Data to validate:", dataToValidate);
            // Perform validation, checking all fields (abortEarly: false)
            await schema.validate(dataToValidate, { abortEarly: false });
            setErrors({}); // Clear any previous errors on success
            console.log("DEBUG: Validation successful for step:", currentStep);
            return true; // Indicate validation passed
        } catch (err) {
            // Handle Yup validation errors
            if (err instanceof Yup.ValidationError) {
                // Convert Yup's error array into an object map { fieldName: errorMessage }
                const formattedErrors = {};
                err.inner.forEach(error => {
                    if (error.path && !formattedErrors[error.path]) { // Take the first error per field
                        formattedErrors[error.path] = error.message;
                    }
                });
                setErrors(formattedErrors); // Update the errors state
                console.error("Validation failed:", formattedErrors);
            } else {
                // Handle unexpected errors during validation process
                console.error("Unexpected validation error:", err);
                setErrors({ form: 'An unexpected error occurred. Please try again.' }); // Generic form error
            }
            return false; // Indicate validation failed
        }
        // Dependencies ensure validateStep uses the latest state, step, and relevant schema
    }, [currentStep, formData, loanSchema]); // Depends on step, data, and dynamic loan schema


    // --- Navigation Handlers (Memoized with useCallback) ---
    // Moves to the next step after successful validation
    const handleNextStep = useCallback(async () => {
        const isValid = await validateStep(); // Validate before proceeding
        if (!isValid) {
            return; // Stop if validation fails
        }
        // Determine the next step based on the current one
        if (currentStep === 'personal') setCurrentStep('loan');
        else if (currentStep === 'loan') setCurrentStep('employment');
        else if (currentStep === 'employment') setCurrentStep('review');
        else if (currentStep === 'review') {
            // Final 'Submit' action from the review step
            console.log("Submitting Form Data:", { ...formData, productName: product?.product_name }); // Log final data
            setCurrentStep('complete'); // Transition to the completion view

            // --- TODO: Add API call here to send formData to the backend ---

            const dataSent = {
                customer_id: 1,
                product_id: product?.product_id,
                requested_amount: formData.loanAmount,
                requested_term: formData.loanTerm,
                purpose: formData.loanPurpose,
                status: 'pending'
            }
            try {
                const response = await fetch('http://localhost:8000/api/loans/apply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify(dataSent), // Send relevant data
                });
                if (!response.ok) throw new Error('Submission failed');
                // Handle success further if needed
                setToast({
                    message: `Application for ${product?.product_name ?? 'loan'} submitted successfully!`,
                    type: 'success'
                });
            } catch (apiError) {
                console.error("API Submission Error:", apiError);
                setToast({ message: 'Failed to submit application. Please try again.', type: 'error' });
                setCurrentStep('review'); // Optionally move back to review step on failure
            }
            // --- End TODO ---
        }
    }, [currentStep, validateStep, product, formData]); // Dependencies

    // Moves to the previous step
    const handlePrevStep = useCallback(() => {
        console.log(`DEBUG: Moving back from step: ${currentStep}`);
        setErrors({}); // Clear validation errors when navigating back
        // Determine the step to go back to
        if (currentStep === 'loan') setCurrentStep('personal');
        else if (currentStep === 'employment') setCurrentStep('loan');
        else if (currentStep === 'review') setCurrentStep('employment');
    }, [currentStep]); // Dependency: currentStep


    // --- Animation Variants and Progress Stepper Logic ---
    const stepVariants = { // Animation definitions for step transitions
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };
    const stepsArray = ['personal', 'loan', 'employment', 'review']; // Define the order of steps
    const currentStepIndex = stepsArray.indexOf(currentStep); // Get index of the current step

    // --- Stepper Styling Helper Functions ---
    const getStepClass = (index) => { // Determines class for the step circle
        if (index === currentStepIndex) return 'bg-blue-600 scale-110 shadow-md'; // Active step style
        if (index < currentStepIndex) return 'bg-green-500'; // Completed step style
        return 'bg-gray-300'; // Future step style
    };

    const getConnectorClass = (index) => { // Determines class for the connector line
        if (index < currentStepIndex) return 'bg-green-500'; // Connector after completed step
        return 'bg-gray-300'; // Connector for future steps
    };

    // --- Reusable Render Functions for Form Fields ---
    // Renders a standard input field with label and error message
    const renderInput = (id, name, label, type = 'text', props = {}) => (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                value={formData[name]} // Controlled component
                onChange={handleInputChange} // Update state on change
                aria-invalid={!!errors[name]} // Accessibility: indicate invalid state
                aria-describedby={errors[name] ? `${id}-error` : undefined} // Link input to error message
                className={`block w-full px-3 py-2 border ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-150 ease-in-out`}
                {...props} // Allow passing additional props like placeholder, readOnly
            />
            {/* Display validation error if exists */}
            {errors[name] && <p id={`${id}-error`} className="text-red-600 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    // Renders a select dropdown with label and error message
    const renderSelect = (id, name, label, options, props = {}) => (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                id={id}
                name={name}
                value={formData[name]} // Controlled component
                onChange={handleInputChange} // Update state on change
                aria-invalid={!!errors[name]} // Accessibility
                aria-describedby={errors[name] ? `${id}-error` : undefined}
                className={`block w-full px-3 py-2 pr-8 border ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white sm:text-sm appearance-none transition-colors duration-150 ease-in-out`}
                {...props}
            >
                {/* Default placeholder option */}
                <option value="" disabled>
                    {props.placeholder || "Select..."}
                </option>
                {/* Map through the provided term options */}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {/* Display validation error if exists */}
            {errors[name] && <p id={`${id}-error`} className="text-red-600 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    // --- Render Step Content Function ---
    // Determines which form section to display based on currentStep state
    const renderStepContent = () => {
        switch (currentStep) {
            case 'personal':
                return (
                    // Personal Information Step JSX
                    <motion.div key="personal" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                            <p className="text-sm text-gray-500">Please provide your personal details.</p>
                            {/* Display general form error if exists */}
                            {errors.form && <p className="text-red-600 text-sm font-medium mt-2">{errors.form}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {renderInput('firstName', 'firstName', 'First Name')}
                            {renderInput('lastName', 'lastName', 'Last Name')}
                            {renderInput('email', 'email', 'Email Address', 'email')}
                            {renderInput('phone', 'phone', 'Phone Number', 'tel', { placeholder: 'e.g., 08012345678' })}
                            <div className="md:col-span-2">
                                {renderInput('address', 'address', 'Home Address')}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'loan':
                return (
                    // Loan Details Step JSX
                    <motion.div key="loan" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl text-center font-semibold text-gray-900">Loan Details</h2>

                            {errors.form && <p className="text-red-600 text-sm font-medium mt-2">{errors.form}</p>}
                        </div>
                        <div className="space-y-5"> {/* Adjusted spacing */}
                            {/* Loan Type (Display Only) */}
                            <div className="space-y-1.5 mb-16">
                                <label htmlFor="loanAmountSlider" className="flex gap-2 items-center text-lg font-medium text-gray-700">
                                    Loan Type: <span className='font-semibold text-lg text-gray-900'>{formData.loanPurpose}</span>
                                </label>
                            </div>

                            {/* Loan Amount Slider */}
                            <div className="space-y-1.5 mb-16">
                                <label htmlFor="loanAmountSlider" className="flex gap-2 items-center text-lg font-medium text-gray-700">
                                    Loan Amount: <span className='font-semibold text-lg text-gray-900'>{formatCurrency(formData.loanAmount)}</span>
                                </label>
                                <input
                                    type="range"
                                    id="loanAmountSlider"
                                    name="loanAmount"
                                    value={formData.loanAmount}
                                    min={minAmount} // Use derived min value
                                    max={maxAmount} // Use derived max value
                                    // Dynamic step for better usability across different ranges
                                    step={Math.max(1000, Math.round((maxAmount - minAmount) / 100))}
                                    onChange={handleSliderChange}
                                    aria-describedby={errors.loanAmount ? `loanAmountSlider-error` : undefined}
                                    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 ${errors.loanAmount ? 'ring-2 ring-offset-1 ring-red-500' : ''}`}
                                />
                                <div className="flex justify-between text-xs text-gray-500 px-1">
                                    <span>{formatCurrency(minAmount)}</span>
                                    <span>{formatCurrency(maxAmount)}</span>
                                </div>
                                {/* Error message specifically for the slider */}
                                {errors.loanAmount && <p id="loanAmountSlider-error" className="text-red-600 text-xs mt-1">{errors.loanAmount}</p>}
                            </div>

                            {/* Loan Term Selection */}
                            {renderSelect(
                                'loanTerm',
                                'loanTerm',
                                'Loan Term',
                                termOptions, // Use dynamically generated term options
                                { placeholder: "Select desired term" }
                            )}
                        </div>
                    </motion.div>
                );

            case 'employment':
                return (
                    // Employment Information Step JSX
                    <motion.div key="employment" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold text-gray-900">Employment Information</h2>
                            <p className="text-sm text-gray-500">Please provide your current employment details.</p>
                            {errors.form && <p className="text-red-600 text-sm font-medium mt-2">{errors.form}</p>}
                        </div>
                        <div className="space-y-4">
                            {renderSelect('employmentStatus', 'employmentStatus', 'Employment Status', [
                                { value: "full-time", label: "Full-Time Employed" },
                                { value: "part-time", label: "Part-Time Employed" },
                                { value: "self-employed", label: "Self-Employed / Business Owner" },
                                { value: "unemployed", label: "Unemployed" },
                                { value: "retired", label: "Retired" },
                                { value: "student", label: "Student" },
                            ], { placeholder: "Select employment status" })}

                            {/* Conditional fields based on status are handled by Yup validation rules */}
                            {renderInput('employer', 'employer', 'Employer / Company Name')}
                            {/* Use the determined currency symbol in the label */}
                            {renderInput('income', 'income', `Annual Income (${currency})`, 'number', { placeholder: 'e.g., 3000000' })}
                            {renderInput('startDate', 'startDate', 'Employment Start Date', 'date')}
                        </div>
                    </motion.div>
                );

            case 'review':
                // Review Application Step JSX
                return (
                    <motion.div key="review" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold text-gray-900">Review Application</h2>
                            <p className="text-sm text-gray-500">Please check all your information carefully before submitting.</p>
                        </div>
                        {/* Use dividers for better separation of review sections */}
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
                                    <div><dt className="text-gray-500">Amount:</dt><dd className="text-gray-900 font-semibold mt-0.5">{formatCurrency(formData.loanAmount)}</dd></div>
                                    <div><dt className="text-gray-500">Purpose/Type:</dt><dd className="text-gray-900 mt-0.5">{formData.loanPurpose || 'N/A'}</dd></div>
                                    <div><dt className="text-gray-500">Term:</dt><dd className="text-gray-900 mt-0.5">{formData.loanTerm ? `${formData.loanTerm} months` : 'N/A'}</dd></div>
                                </dl>
                            </div>
                            {/* Employment Info Review Section */}
                            <div className="pt-5">
                                <h3 className="text-base font-semibold text-gray-800 mb-3">Employment Information</h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <div><dt className="text-gray-500">Status:</dt><dd className="text-gray-900 mt-0.5">{formData.employmentStatus || 'N/A'}</dd></div>
                                    <div><dt className="text-gray-500">Employer/Business:</dt><dd className="text-gray-900 mt-0.5">{formData.employer || 'N/A'}</dd></div>
                                    <div><dt className="text-gray-500">Annual Income:</dt><dd className="text-gray-900 mt-0.5">{formData.income ? formatCurrency(Number(formData.income)) : 'N/A'}</dd></div>
                                    <div><dt className="text-gray-500">Start Date:</dt><dd className="text-gray-900 mt-0.5">{formData.startDate || 'N/A'}</dd></div>
                                </dl>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'complete':
                // Complete step JSX - unchanged from previous versions
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
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg max-w-xs mx-auto text-left"> {/* Adjusted styling */}
                                    <div className="text-xs space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Application Ref:</span>
                                            <span className="font-medium text-gray-700">BL-{Math.floor(100000 + Math.random() * 900000)}</span>
                                        </div>
                                        <hr className="border-gray-100" />
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Submitted Date:</span>
                                            <span className="font-medium text-gray-700">{new Date().toLocaleDateString('en-GB')}</span> {/* UK format DD/MM/YYYY */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                );

            default:
                return null; // Should not happen
        }
    };


    // --- Main Component Return ---
    return (
        <div className="bg-white inter border border-gray-200 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-lg">

            {/* Progress Stepper (Rendered unless complete) */}
            {currentStep !== 'complete' && (
                <div className="mb-8">
                    <div className="flex items-center mb-4 sm:mb-8"> {/* Adjusted margin */}
                        {stepsArray.map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center text-center flex-shrink-0 mx-1 sm:mx-2"> {/* Added shrinking and margin */}
                                    {/* Stepper Dot */}
                                    <motion.div
                                        initial={false}
                                        animate={{ scale: index === currentStepIndex ? 1.15 : 1 }} // Slightly larger scale
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm ${getStepClass(index)} transition-colors duration-300 shadow-sm`}
                                    >
                                        {index + 1}
                                    </motion.div>
                                    {/* Stepper Label */}
                                    <div className="text-xs mt-1.5 hidden sm:block capitalize text-gray-600 font-medium">
                                        {step.replace('-', ' ')} {/* Simple formatting */}
                                    </div>
                                </div>
                                {/* Connector Line */}
                                {index < stepsArray.length - 1 && (
                                    <div className={`flex-1 h-0.5 ${getConnectorClass(index)} transition-colors duration-300 mt-[-16px] sm:mt-[-20px]`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <hr className="border-gray-200" />
                </div>
            )}

            {/* Step Content Area */}
            <div className="mt-8 min-h-[350px] md:min-h-[400px]"> {/* Ensure minimum height for content area */}
                {/* Render the content for the current step */}
                {renderStepContent()}
            </div>

            {/* Navigation Buttons (Rendered unless complete) */}
            {currentStep !== 'complete' && (
                <div className={`flex mt-10 pt-6 border-t border-gray-100 ${currentStep === 'personal' ? 'justify-end' : 'justify-between'}`}>
                    {/* Back Button (Rendered on steps after the first) */}
                    {currentStep !== 'personal' && (
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-5 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    {/* Continue/Submit Button */}
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-5 py-2 border cursor-pointer border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                    >
                        {currentStep === 'review' ? 'Submit Application' : 'Continue'}
                    </button>
                </div>
            )}

            {/* Completion Actions (Rendered only on complete step) */}
            {currentStep === 'complete' && (
                <div className="mt-10 flex justify-center pt-6 border-t border-gray-100">
                    {/* Example: Link to a dashboard or loans page */}
                    <button
                        type="button"
                        onClick={() => { console.log("Navigate to /my-loans"); window.location.href = '/my-loans'; }} // Simple redirect for now
                        className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                    >
                        Go to My Loans
                    </button>
                    {/* Could add another button like "Apply for Another Loan" */}
                </div>
            )}
        </div>
    );
};

export default LoanApplicationForm;