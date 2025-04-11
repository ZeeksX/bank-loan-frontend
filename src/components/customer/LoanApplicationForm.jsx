import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Ensure React is imported
import * as Yup from 'yup';
import Toast from '../Toast'; // Assuming Toast component path is correct

// Import the new components
import ProgressStepper from './ProgressStepper';
import PersonalDetailsStep from './PersonalDetailsStep';
import LoanDetailsStep from './LoanDetailsStep';
import EmploymentDetailsStep from './EmploymentDetailsStep';
import ReviewAndCompleteStep from './ReviewAndCompleteStep'; // Import the fixed component
// Optionally import helpers if defined separately
// import { renderInput, renderSelect } from './formHelpers';

// --- Static Schemas (Can stay outside or be moved to a separate schemas file) ---
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

// --- Default values ---
const DEFAULT_MIN_AMOUNT = 100000;
const DEFAULT_MAX_AMOUNT = 5000000;
const DEFAULT_MIN_TERM = 6;
const DEFAULT_MAX_TERM = 60;
const DEFAULT_CURRENCY = 'NGN';
const DEFAULT_CURRENCY_LOCALE = 'en-NG';

const LoanApplicationForm = ({ product }) => {
    // --- Determine Loan Constraints ---
    const minAmount = product?.min_amount ?? DEFAULT_MIN_AMOUNT;
    const maxAmount = product?.max_amount ?? DEFAULT_MAX_AMOUNT;
    const minTerm = product?.min_term ?? DEFAULT_MIN_TERM;
    const maxTerm = product?.max_term ?? DEFAULT_MAX_TERM;
    const currency = product?.currency ?? DEFAULT_CURRENCY;
    const currencyLocale = product?.locale ?? DEFAULT_CURRENCY_LOCALE;

    // --- State Definitions ---
    const [currentStep, setCurrentStep] = useState('personal');
    const [formData, setFormData] = useState({
        // Initial form data fields
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        application_reference: '',
        loanAmount: minAmount, // Initialize with potentially product-specific minAmount
        loanPurpose: product?.product_name ?? '',
        loanTerm: minTerm.toString(), // Initialize with potentially product-specific minTerm
        employmentStatus: '',
        employer: '',
        income: '',
        startDate: '',
    });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    // --- Dynamic Loan Schema (Memoized) ---
    const loanSchema = useMemo(() => {
        console.log(`DEBUG: Creating loan schema with minAmount: ${minAmount}, maxAmount: ${maxAmount}, minTerm: ${minTerm}, maxTerm: ${maxTerm}`);
        // Helper for formatting currency in validation messages
        const formatMinMax = (val) => {
            try {
                return new Intl.NumberFormat(currencyLocale, { style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
            } catch {
                return `${currency} ${val}`; // Fallback
            }
        };

        return Yup.object().shape({
            loanAmount: Yup.number()
                .min(minAmount, `Minimum loan amount is ${formatMinMax(minAmount)}`)
                .max(maxAmount, `Maximum loan amount is ${formatMinMax(maxAmount)}`)
                .required('Loan amount is required')
                .typeError('Loan amount must be a valid number'),
            loanPurpose: Yup.string().required('Loan purpose is required'), // Basic check
            loanTerm: Yup.number() // Validate term as a number
                .min(minTerm, `Minimum term is ${minTerm} months`)
                .max(maxTerm, `Maximum term is ${maxTerm} months`)
                .required('Please select a loan term')
                .typeError('Loan term must be selected'),
        });
    }, [minAmount, maxAmount, minTerm, maxTerm, currency, currencyLocale]); // Add currency dependencies

    // --- Effect to sync formData after initial product load ---
    useEffect(() => {
        if (product) {
            // Only sync if the form fields likely haven't been touched by the user yet
            // based on comparing with the *absolute* defaults, not the product-specific ones
            const needsSync =
                (formData.loanAmount === DEFAULT_MIN_AMOUNT && minAmount !== DEFAULT_MIN_AMOUNT) ||
                (formData.loanTerm === DEFAULT_MIN_TERM.toString() && minTerm.toString() !== DEFAULT_MIN_TERM.toString()) ||
                (formData.loanPurpose === '' && (product.product_name ?? '') !== '');


            if (needsSync) {
                console.log("DEBUG: Product prop available/changed, syncing initial form fields...");
                setFormData(prev => ({
                    ...prev,
                    // Update only the fields that need syncing based on the product
                    loanAmount: minAmount, // Ensure amount starts at product min
                    loanPurpose: product.product_name || '', // Ensure purpose matches product
                    loanTerm: minTerm.toString(), // Ensure term starts at product min
                }));
            }
        }
        // Run this effect when the product prop itself changes OR when the derived limits change
        // This ensures that if the product data loads asynchronously after the initial render,
        // the form defaults align with the product specifics.
    }, [product, minAmount, maxAmount, minTerm, maxTerm]); // Added maxAmount, currency related fields not needed here


    // --- Generate Term Options (Memoized) ---
    const termOptions = useMemo(() => {
        const options = [];
        const start = Number(minTerm);
        const end = Number(maxTerm);

        if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let t = start; t <= end; t++) {
                options.push({ value: t.toString(), label: `${t} months` });
            }
            // Ensure the current formData.loanTerm is valid, reset if not
            if (!options.some(opt => opt.value === formData.loanTerm)) {
                console.log("DEBUG: Current loan term is outside new options, resetting to minTerm");
                // This might be too aggressive if user navigated back, consider context
                // setFormData(prev => ({...prev, loanTerm: minTerm.toString()})); // Potential reset if needed
            }
            return options;
        }
        console.warn("Product term limits invalid or missing. Using fallback term options.");
        // Fallback options should still respect the default min/max if possible
        const fallbackOptions = [
            { value: "12", label: "12 months" }, { value: "24", label: "24 months" },
            { value: "36", label: "36 months" }, { value: "48", label: "48 months" },
            { value: "60", label: "60 months" },
        ];
        // Filter fallback by default limits if they make sense
        return fallbackOptions.filter(opt => Number(opt.value) >= DEFAULT_MIN_TERM && Number(opt.value) <= DEFAULT_MAX_TERM);

    }, [minTerm, maxTerm, formData.loanTerm]); // Recalculate if limits change or form term changes (for validation check)


    // --- Input Handlers (Memoized) ---
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
    }, [errors]);

    const handleSliderChange = useCallback((e) => {
        const value = parseInt(e.target.value, 10);
        const clampedValue = Math.min(value, maxAmount);
        setFormData(prev => ({ ...prev, loanAmount: clampedValue }));
        if (errors.loanAmount) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.loanAmount;
                return newErrors;
            });
        }
    }, [errors, maxAmount]); 

    // --- Validation Logic (Memoized) ---
    const validateStep = useCallback(async () => {
        let schema;
        let dataToValidate = {};
        const currentData = { ...formData };

        console.log(`DEBUG: Validating step: ${currentStep}`);
        if (currentStep === 'personal') {
            schema = personalSchema;
            dataToValidate = {
                firstName: currentData.firstName, lastName: currentData.lastName, email: currentData.email,
                phone: currentData.phone, address: currentData.address,
            };
        } else if (currentStep === 'loan') {
            schema = loanSchema;
            dataToValidate = {
                loanAmount: currentData.loanAmount,
                loanPurpose: currentData.loanPurpose,
                loanTerm: parseInt(currentData.loanTerm, 10) || null, 
            };
        } else if (currentStep === 'employment') {
            schema = employmentSchema;
            dataToValidate = {
                employmentStatus: currentData.employmentStatus, employer: currentData.employer,
                income: currentData.income === '' ? null : currentData.income,
                startDate: currentData.startDate === '' ? null : currentData.startDate,
            };
        } else {
            return true; 
        }

        try {
            console.log("DEBUG: Data to validate:", dataToValidate);
            await schema.validate(dataToValidate, { abortEarly: false });
            setErrors({}); 
            console.log("DEBUG: Validation successful for step:", currentStep);
            return true; 
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const formattedErrors = {};
                err.inner.forEach(error => {
                    if (error.path && !formattedErrors[error.path]) { 
                        formattedErrors[error.path] = error.message;
                    }
                });
                setErrors(formattedErrors); 
                console.error("Validation failed:", formattedErrors);
            } else {
                console.error("Unexpected validation error:", err);
                setErrors({ form: 'An unexpected error occurred. Please try again.' }); 
            }
            return false; 
        }
    }, [currentStep, formData, loanSchema]); 


    // --- Navigation Handlers (Memoized) ---
    const handleNextStep = useCallback(async () => {
        const isValid = await validateStep();
        if (!isValid) {
            return; 
        }
        // Determine the next step based on the current one
        if (currentStep === 'personal') setCurrentStep('loan');
        else if (currentStep === 'loan') setCurrentStep('employment');
        else if (currentStep === 'employment') setCurrentStep('review');
        else if (currentStep === 'review') {
            // Final 'Submit' action from the review step
            console.log("Submitting Form Data:", { ...formData, productName: product?.product_name }); 

            // --- API call ---
            const user = JSON.parse(localStorage.getItem('user') || '{}'); 
            const token = localStorage.getItem('access_token');

            if (!user?.userId || !token) {
                console.error("User not logged in or token missing.");
                setToast({ message: 'You must be logged in to apply.', type: 'error' });
                window.location.href = '/login';
                return;
            }

            const dataSent = {
                customer_id: user.userId,
                product_id: product?.product_id,
                requested_amount: formData.loanAmount,
                requested_term: formData.loanTerm,
                purpose: formData.loanPurpose,
            };

            // Basic check for essential product info
            if (!dataSent.product_id) {
                console.error("Product ID is missing.");
                setToast({ message: 'Cannot submit application without a selected product.', type: 'error' });
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/loans/apply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dataSent),
                });

                const responseBody = await response.text();

                if (!response.ok) {
                    let errorMessage = `Submission failed with status: ${response.status}.`;
                    try {
                        const errorJson = JSON.parse(responseBody);
                        errorMessage = errorJson.message || errorJson.detail || errorMessage;
                    } catch (parseError) {
                        errorMessage = responseBody || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                try {
                    const result = JSON.parse(responseBody);
                    console.log("API Success:", result);
                    if (result.application_reference) {
                        setFormData(prev => ({ ...prev, application_reference: result.application_reference }));
                    }
                } catch (parseError) {
                    console.log("API Success (non-JSON response):", responseBody)
                    console.error("Unsuccessful: ", parseError)
                }

                setCurrentStep('complete');
                setToast({
                    message: `Application for ${product?.product_name ?? 'loan'} submitted successfully!`,
                    type: 'success'
                });

            } catch (apiError) {
                console.error("API Submission Error:", apiError);
                setToast({ message: apiError.message || 'Failed to submit application. Please try again.', type: 'error' });
            }
            // --- End API call ---
        }
    }, [currentStep, validateStep, product, formData]);

    const handlePrevStep = useCallback(() => {
        console.log(`DEBUG: Moving back from step: ${currentStep}`);
        setErrors({});
        if (currentStep === 'loan') setCurrentStep('personal');
        else if (currentStep === 'employment') setCurrentStep('loan');
        else if (currentStep === 'review') setCurrentStep('employment');
    }, [currentStep]);

    // --- Stepper Logic ---
    const stepsArray = ['personal', 'loan', 'employment', 'review'];
    const currentStepIndex = stepsArray.indexOf(currentStep);


    // --- Render Step Content Function ---
    // This function now decides which component to render
    const renderStepContent = () => {
        switch (currentStep) {
            case 'personal':
                return <PersonalDetailsStep
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                />;
            case 'loan':
                return <LoanDetailsStep
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    handleSliderChange={handleSliderChange}
                    minAmount={minAmount}
                    maxAmount={maxAmount}
                    termOptions={termOptions}
                    currency={currency}
                    currencyLocale={currencyLocale}
                />;
            case 'employment':
                return <EmploymentDetailsStep
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    currency={currency}
                />;
            case 'review':
            case 'complete': // ReviewAndCompleteStep handles both internally
                return <ReviewAndCompleteStep
                    formData={formData}
                    currentStep={currentStep} 
                    toast={toast}
                    product={product}
                    setToast={setToast} 
                    currency={currency}
                    currencyLocale={currencyLocale}
                />;
            default:
                return null; // Should not happen
        }
    };

    // --- Main Component Return ---
    return (
        <div className="bg-white inter border border-gray-200 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-lg">

            {/* Progress Stepper (Rendered unless complete) */}
            {currentStep !== 'complete' && (
                <ProgressStepper stepsArray={stepsArray} currentStepIndex={currentStepIndex} />
            )}

            {/* Step Content Area */}
            {/* Ensure minimum height to prevent layout jumps during step transitions */}
            <div className="mt-8 min-h-[350px] md:min-h-[400px] flex flex-col">
                {/* Render the appropriate step component */}
                {renderStepContent()}
            </div>

            {/* Navigation Buttons (Rendered unless complete) */}
            {currentStep !== 'complete' && (
                <div className={`flex mt-10 pt-6 border-t border-gray-100 ${currentStep === 'personal' ? 'justify-end' : 'justify-between'}`}>
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
                    <button
                        type="button"
                        onClick={() => { console.log("Navigate to /my-loans"); window.location.href = '/my-loans'; }}
                        className="px-5 py-2 cursor-pointer hover:bg-blue-500 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
                    >
                        Go to My Loans
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoanApplicationForm;