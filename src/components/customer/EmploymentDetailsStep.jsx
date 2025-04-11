import React from 'react';
import { motion } from 'framer-motion';
import { renderInput, renderSelect } from './FormHelpers';

const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

const EmploymentDetailsStep = ({ formData, errors, handleInputChange, currency }) => {
    const employmentOptions = [
        { value: "full-time", label: "Full-Time Employed" },
        { value: "part-time", label: "Part-Time Employed" },
        { value: "self-employed", label: "Self-Employed / Business Owner" },
        { value: "unemployed", label: "Unemployed" },
        { value: "retired", label: "Retired" },
        { value: "student", label: "Student" },
    ];

    // Determine if fields should be visible based on employment status
    // Note: Validation still handles requirement logic, this is just for optional display changes
    const showEmployerIncomeFields = ['full-time', 'part-time', 'self-employed'].includes(formData.employmentStatus);

    return (
        <motion.div key="employment" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-gray-900">Employment Information</h2>
                <p className="text-sm text-gray-500">Please provide your current employment details.</p>
                {errors.form && <p className="text-red-600 text-sm font-medium mt-2">{errors.form}</p>}
            </div>
            <div className="space-y-4">
                {renderSelect(
                    'employmentStatus',
                    'employmentStatus',
                    'Employment Status',
                    formData,
                    handleInputChange,
                    errors,
                    employmentOptions,
                    { placeholder: "Select employment status" }
                )}

                {/* Conditionally render related fields */}
                {showEmployerIncomeFields && (
                    <>
                        {renderInput('employer', 'employer', 'Employer / Company Name', formData, handleInputChange, errors)}
                        {renderInput('income', 'income', `Annual Income (${currency})`, formData, handleInputChange, errors, 'number', { placeholder: 'e.g., 3000000' })}
                        {renderInput('startDate', 'startDate', 'Employment Start Date', formData, handleInputChange, errors, 'date')}
                    </>
                )}
                {/* If status is not one requiring the above, you might optionally clear them */}
                {/* Or rely solely on validation to ignore them */}

            </div>
        </motion.div>
    );
};

export default EmploymentDetailsStep;