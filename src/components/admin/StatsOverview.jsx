// src/components/admin/StatsOverview.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import StatusBadge from './StatusBadge';

const StatsOverview = ({ customers, loans, allApplications, recentApplications, payments, setPayments }) => {
    const calculateStats = (customers, loans, allApplications) => {
        const totalUsers = customers?.length || 0;
        const totalActiveLoans = customers?.reduce((count, customer) => {
            return count + (parseInt(customer.active) || 0);
        }, 0) || 0;

        const pendingApprovals = allApplications?.filter(app =>
            ['Pending', 'In Review'].includes(app.status)
        ).length || 0;

        // Sum the amount_paid from all payments
        const revenue = payments?.reduce((sum, payment) => {
            // Remove any currency symbols and commas if needed before parsing
            const amount = parseFloat(String(payment.amount_paid).replace(/[₦,]/g, '')) || 0;
            return sum + amount;
        }, 0) || 0;

        const totalRevenue = `₦${revenue.toLocaleString()}`;

        return [
            {
                title: 'Total Users',
                value: totalUsers.toLocaleString(),
                icon: Users,
                color: 'blue'
            },
            {
                title: 'Active Loans',
                value: totalActiveLoans.toLocaleString(),
                icon: FileText,
                color: 'blue'
            },
            {
                title: 'Total Revenue',
                value: totalRevenue,
                icon: DollarSign,
                color: 'green'
            },
            {
                title: 'Pending Approvals',
                value: pendingApprovals.toLocaleString(),
                icon: AlertTriangle,
                color: 'amber'
            }
        ];
    };

    const statsData = calculateStats(customers, loans, allApplications);

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {statsData.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="border bg-white rounded-lg shadow-sm mt-8">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApplications.length > 0 ? (
                                        recentApplications.map((app) => (
                                            <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{app.id}</td>
                                                <td className="px-6 py-4">{app.customer}</td>
                                                <td className="px-6 py-4">₦{app.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">{app.type}</td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={app.status} />
                                                </td>
                                                <td className="px-6 py-4">{app.date}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='bg-white border-b hover:bg-gray-50'>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No recent applications</td>
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

export default StatsOverview;