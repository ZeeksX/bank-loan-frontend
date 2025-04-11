import React from 'react';
import { motion } from 'framer-motion';
import { renderInput } from './FormHelpers';

const stepVariants = { // Keep animations consistent
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

const PersonalDetailsStep = ({ formData, errors, handleInputChange }) => {
    return (
        <motion.div key="personal" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.4 }} className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500">Please provide your personal details.</p>
                {/* Display general form error if exists */}
                {errors.form && <p className="text-red-600 text-sm font-medium mt-2">{errors.form}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {renderInput('firstName', 'firstName', 'First Name', formData, handleInputChange, errors)}
                {renderInput('lastName', 'lastName', 'Last Name', formData, handleInputChange, errors)}
                {renderInput('email', 'email', 'Email Address', formData, handleInputChange, errors, 'email')}
                {renderInput('phone', 'phone', 'Phone Number', formData, handleInputChange, errors, 'tel', { placeholder: 'e.g., 08012345678' })}
                <div className="md:col-span-2">
                    {renderInput('address', 'address', 'Home Address', formData, handleInputChange, errors)}
                </div>
            </div>
        </motion.div>
    );
};

export default PersonalDetailsStep;