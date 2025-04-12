import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Settings,
  Shield,
  BarChart,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { motion } from "framer-motion";

const Sidebar = () => {
  const adminMenuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      title: 'Loan Applications',
      icon: FileText,
      path: '/admin/loans',
    },
    {
      title: 'Users',
      icon: Users,
      path: '/admin/users',
    },
    {
      title: 'Payments',
      icon: CreditCard,
      path: '/admin/payments',
    },
  ];

  const settingsMenuItems = [
    {
      title: 'Profile',
      icon: Settings,
      path: '/admin/profile',
    },
    {
      title: 'Loan Products',
      icon: DollarSign,
      path: '/admin/products',
    },
  ];

  return (
    <div className="inter w-64 fixed min-h-screen bg-white shadow-md flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center p-6">
        <Link to="/" className="flex  items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">B</span>
          </motion.div>
          <span className="font-semibold text-xl text-zinc-900">BankLoan</span>
        </Link>
      </div>

      {/* Sidebar Menu Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Section */}
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Main</p>
          <ul className="space-y-1">
            {adminMenuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  title={item.title}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Configuration Section */}
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Configuration</p>
          <ul className="space-y-1">
            {settingsMenuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  title={item.title}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </div>
  );
};
export default Sidebar;