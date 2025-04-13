// src/components/LoanProductForm.jsx
import React from 'react';
import { motion } from "framer-motion";

const LoanProductForm = ({ formData, onInputChange, onSubmit, onCancel }) => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 border bg-white rounded-lg shadow-sm "
        >
            <h2 className="text-xl font-semibold mb-4">{formData.product_id ? 'Edit Loan Product' : 'New Loan Product'}</h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.product_id && (
                    <input type="hidden" name="id" value={formData.product_id} onChange={onInputChange} />
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%) *</label>
                    <input
                        type="number"
                        step="0.01"
                        name="interest_rate"
                        value={formData.interest_rate}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Term (months) *</label>
                    <input
                        type="number"
                        name="min_term"
                        value={formData.min_term}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Term (months) *</label>
                    <input
                        type="number"
                        name="max_term"
                        value={formData.max_term}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Amount *</label>
                    <input
                        type="number"
                        step="0.01"
                        name="min_amount"
                        value={formData.min_amount}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Amount *</label>
                    <input
                        type="number"
                        step="0.01"
                        name="max_amount"
                        value={formData.max_amount}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                    <textarea
                        name="eligibility_criteria"
                        value={formData.eligibility_criteria}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={2}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="inline-flex items-center text-sm text-gray-700">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            name="requires_collateral"
                            checked={formData.requires_collateral}
                            onChange={onInputChange}
                        />
                        <span className="ml-2">Requires Collateral</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Early Payment Fee</label>
                    <input
                        type="text"
                        name="early_payment_fee"
                        value={formData.early_payment_fee}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Late Payment Fee</label>
                    <input
                        type="text"
                        name="late_payment_fee"
                        value={formData.late_payment_fee}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="inline-flex items-center text-sm text-gray-700">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={onInputChange}
                        />
                        <span className="ml-2">Active</span>
                    </label>
                </div>

                <div className="flex justify-end space-x-3 md:col-span-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {formData.product_id ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default LoanProductForm;