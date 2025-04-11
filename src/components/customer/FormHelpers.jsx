import React from 'react';

// Reusable Input Field Renderer
export const renderInput = (id, name, label, formData, handleInputChange, errors, type = 'text', props = {}) => (
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

// Reusable Select Field Renderer
export const renderSelect = (id, name, label, formData, handleInputChange, errors, options, props = {}) => (
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
            {/* Map through the provided options */}
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