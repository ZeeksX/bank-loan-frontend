// src/components/admin/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ activeTab, handleTabChange, tabs }) => {
    // Capitalize first letter of tab name for display
    const formatTabName = (tab) => tab.charAt(0).toUpperCase() + tab.slice(1);

    return (
        <div className="mb-8 border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`w-1/2 cursor-pointer sm:w-auto inline-block p-4 border-b-2 rounded-t-lg font-medium text-center ${activeTab === tab
                                ? 'text-blue-600 border-blue-600'
                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                            }`}
                    >
                        {formatTabName(tab)}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TabNavigation;