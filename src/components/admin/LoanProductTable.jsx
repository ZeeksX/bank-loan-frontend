// src/components/LoanProductTable.jsx
import React from 'react';
import { motion } from "framer-motion";

const LoanProductTable = ({ products, onEdit, onDeactivate, onDelete }) => {
    const getStatusClasses = (isActive) =>
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
        >
            <div className="border bg-white rounded-lg shadow-sm mt-8">
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">All Loan Products</h3>
                </div>
                <div className="p-4 pt-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Product Name</th>
                                    <th className="px-6 py-3">Interest Rate</th>
                                    <th className="px-6 py-3">Term Range</th>
                                    <th className="px-6 py-3">Amount Range</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.product_id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.product_name}</td>
                                        <td className="px-6 py-4">{product.interest_rate}%</td>
                                        <td className="px-6 py-4">{product.min_term}-{product.max_term} months</td>
                                        <td className="px-6 py-4">
                                            ₦{parseFloat(product.min_amount).toLocaleString()} - ₦{parseFloat(product.max_amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(product.is_active)}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDeactivate(product.product_id, product.is_active)}
                                                    className={`cursor-pointer text-${product.is_active ? 'red-600 hover:red-800' : 'green-600 hover:green-800'}`}
                                                >
                                                    {product.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => onDelete(product)}
                                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr className="bg-white border-b">
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No products found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LoanProductTable;