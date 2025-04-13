// src/components/admin/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
    // Helper function for status colors (Light mode only)
    const getStatusColor = (status) => {
        // Normalize the status to lowercase for consistent comparison
        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case 'approved':
            case 'active':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
            case 'suspended':
                return 'bg-red-100 text-red-800';
            case 'in review':
                return 'bg-blue-100 text-blue-800';
            case 'in progress':
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${getStatusColor(status)}`}>
            {status}
        </div>
    );
};

export default StatusBadge;