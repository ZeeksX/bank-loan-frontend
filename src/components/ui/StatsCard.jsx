import React from 'react'

const StatsCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        amber: 'text-amber-500',
        red: 'text-red-600'
    };
    return (
        <div className="border bg-white rounded-lg shadow-sm inter">
            <div className="p-4 pb-2">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            </div>
            <div className="p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${colorClasses[color]} opacity-80`} />
                </div>
                <p className="text-xs text-gray-500 mt-2">{trend}</p>
            </div>
        </div>
    );
};

export default StatsCard