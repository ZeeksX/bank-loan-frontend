import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({
    title,
    value,
    icon,
    description,
    trend,
    delay = 0,
    className = '',
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <div className="text-blue-600">
                    {icon}
                </div>
            </div>

            <p className="text-2xl font-bold mt-2 text-gray-900">{value}</p>

            <div className="flex items-center mt-1">
                {trend && (
                    <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
                <span className="text-gray-500 text-sm ml-1">{description}</span>
            </div>
        </motion.div>
    );
};

export default DashboardCard;