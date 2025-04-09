import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CreditCard, DollarSign, LineChart, Wallet } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import ProductCard from '../ui/ProductCard';
import LoanStatus from './LoanStatus';
import RecentPayments from './RecentPayments';

const cardData = [
  {
    id: 1,
    title: 'Total Loans',
    value: '3',
    icon: <CreditCard size={16} />,
    description: 'Active loans in your account',
    delay: 0
  },
  {
    id: 2,
    title: 'Total Outstanding',
    value: '$24,500',
    icon: <DollarSign size={16} />,
    description: 'vs last month',
    trend: { value: 12, isPositive: false },
    delay: 0.1
  },
  {
    id: 3,
    title: 'Next Payment',
    value: '$820',
    icon: <Wallet size={16} />,
    description: 'Due on June 15, 2023',
    delay: 0.2
  },
  {
    id: 4,
    title: 'Credit Score',
    value: '745',
    icon: <BarChart3 size={16} />,
    description: 'vs last month',
    trend: { value: 5, isPositive: true },
    delay: 0.3
  }
];

const Container = () => {
  const productData = useOutletContext();
  const ProductData = productData?.slice(0, 3) || [];

  return (
    <div className="inter min-h-screen flex justify-center w-full items-center bg-gray-50">
      <div className="w-[92%] mx-auto py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-gray-900"
              >
                Welcome to BankLoan
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-500 mt-2"
              >
                Manage your loans and track your financial progress
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/apply"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4 md:mt-0"
              >
                Apply for a Loan
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {cardData.map((card, index) => (
              <DashboardCard
                key={card.id}
                title={card.title}
                value={card.value}
                icon={card.icon}
                description={card.description}
                trend={card.trend}
                delay={index * 0.1} // You can calculate delay based on index
              />
            ))}
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loan Status */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Loan Application Status</h2>
            <LoanStatus />
          </div>

          {/* Recent Payments */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Recent Payments</h2>
            <RecentPayments />
            <div className="mt-6">
              <Link
                to="/payments"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View all payments <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Loan Products */}
        <div className="mt-12 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Available Loan Products</h2>
              <p className="text-gray-500 mt-1">Discover financial solutions tailored to your needs</p>
            </div>

            <Link to="/products">
              <button className="px-4 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors mt-4 md:mt-0">
                View All Products
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ProductData.length > 0 ? (ProductData.map((product) => (
              <motion.div
                key={product.product_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: product.id * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
              >
                <ProductCard product={product} />
              </motion.div>
            ))) : (
              <div className='inter text-2xl font-bold'> No Loan product available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;