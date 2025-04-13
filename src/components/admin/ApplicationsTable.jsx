// src/components/admin/tables/ApplicationsTable.jsx
import React from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

const ApplicationsTable = ({ applications, handleReview, handleApprove, handleReject }) => {
    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="border bg-white rounded-lg shadow-sm mt-8">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">All Loan Applications</h3>
                    </div>
                    <div className="p-4 pt-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Application ID</th>
                                        <th scope="col" className="px-6 py-3">Customer</th>
                                        <th scope="col" className="px-6 py-3">Loan Amount</th>
                                        <th scope="col" className="px-6 py-3">Type</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.length > 0 ? (
                                        applications.map((app) => (
                                            <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{app.id}</td>
                                                <td className="px-6 py-4">{app.customer}</td>
                                                <td className="px-6 py-4">₦{app.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">{app.type}</td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={app.status} />
                                                </td>
                                                <td className="px-6 py-4">{app.date}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleReview(app.id)}
                                                            className="text-blue-600 cursor-pointer hover:text-blue-800 text-xs p-1 font-medium"
                                                        >
                                                            Review
                                                        </button>
                                                        {app.status === 'Pending' || app.status === 'In Review' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(app.id)}
                                                                    className="text-green-600 cursor-pointer hover:text-green-800 text-xs p-1 font-medium"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(app.id)}
                                                                    className="text-red-600 cursor-pointer hover:text-red-800 text-xs p-1 font-medium"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='bg-white border-b hover:bg-gray-50'>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No applications found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ApplicationsTable;