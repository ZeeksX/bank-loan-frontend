import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import { useOutletContext } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { allApplications, customers, loans } = useOutletContext() ?? { allApplications: [], customers: [], loans: [] };

  const calculateStats = (customers, loans, allApplications) => {
    const totalUsers = customers?.length || 0;
    const totalActiveLoans = customers?.reduce((count, customer) => {
      return count + (parseInt(customer.active) || 0);
    }, 0) || 0;

    const pendingApprovals = allApplications?.filter(app => ['Pending', 'In Review'].includes(app.status)).length || 0;
    const totalRevenue = '₦1.2M';

    return [
      { title: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, trend: '+12% from last month', color: 'blue' },
      { title: 'Active Loans', value: totalActiveLoans.toLocaleString(), icon: FileText, trend: '+5% from last month', color: 'blue' },
      { title: 'Total Revenue', value: totalRevenue, icon: DollarSign, trend: '+18% from last month', color: 'green' },
      { title: 'Pending Approvals', value: pendingApprovals.toLocaleString(), icon: AlertTriangle, trend: `${pendingApprovals > 0 ? pendingApprovals : 'No'} pending`, color: 'amber' }
    ];
  };

  // Example usage (assuming 'customers' is your array)
  const statsData = calculateStats(customers, loans, allApplications);
  const recentApplications = allApplications.length > 0 ? (allApplications.slice(0, 5).map((app) => ({
    id: app.id,
    customer: app.customer,
    amount: app.amount,
    type: app.type,
    status: app.status,
    date: app.date
  }))) : [];

  // Helper function for status colors (Light mode only)
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  // Placeholder for button actions
  const handleView = (id) => console.log(`View item ${id}`);
  const handleApprove = async (id) => {
    const response = await fetch(`http://localhost:8000/api/loans/applications/${id + 1}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ status: "approved" })
    })
    if (response.ok) {
      const data = await response.json();
      console.log("Data from the backend: ", data)
    }

  }
  const handleReview = async (id) => {
    const response = await fetch(`http://localhost:8000/api/loans/applications/${id + 1}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ status: "under_review" })
    })
    if (response.ok) {
      const data = await response.json();
      console.log("Data from the backend: ", data)
    }

  }
  const handleReject = (id) => console.log(`Reject item ${id}`);
  const handleEdit = (id) => console.log(`Edit item ${id}`);
  const handleSuspend = (id) => console.log(`Suspend item ${id}`);
  const handleActivate = (id) => console.log(`Activate item ${id}`);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 inter">
        <div className="flex min-h-screen w-full">
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="w-full">
              <div className="mb-8 border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
                  {/* Tab Buttons with active state logic */}
                  <button
                    onClick={() => handleTabChange('overview')}
                    className={`w-1/2 cursor-pointer sm:w-auto inline-block p-4 border-b-2 rounded-t-lg font-medium text-center ${activeTab === 'overview'
                      ? 'text-blue-600 border-blue-600' // Active state styles
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300' // Inactive state styles
                      }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => handleTabChange('loans')}
                    className={`w-1/2 cursor-pointer sm:w-auto inline-block p-4 border-b-2 rounded-t-lg font-medium text-center ${activeTab === 'loans'
                      ? 'text-blue-600 border-blue-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    Loan Applications
                  </button>
                  <button
                    onClick={() => handleTabChange('users')}
                    className={`w-1/2 cursor-pointer sm:w-auto inline-block p-4 border-b-2 rounded-t-lg font-medium text-center ${activeTab === 'users'
                      ? 'text-blue-600 border-blue-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    Users
                  </button>
                </nav>
              </div>

              {/* Overview Tab Content */}
              {activeTab === 'overview' && (
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
                        trend={stat.trend}
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
                              {recentApplications.length > 0 ? (recentApplications.map((app) => (
                                <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{app.id}</td>
                                  <td className="px-6 py-4">{app.customer}</td>
                                  <td className="px-6 py-4">₦{app.amount.toLocaleString()}</td>
                                  <td className="px-6 py-4">{app.type}</td>
                                  <td className="px-6 py-4">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${getStatusColor(app.status)}`}>
                                      {app.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">{app.date}</td>
                                </tr>
                              ))) : (
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

              )}

              {activeTab === 'loans' && (
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
                              {allApplications.map((app, index) => (
                                <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{app.id}</td>
                                  <td className="px-6 py-4">{app.customer}</td>
                                  <td className="px-6 py-4">₦{app.amount.toLocaleString()}</td>
                                  <td className="px-6 py-4">{app.type}</td>
                                  <td className="px-6 py-4">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${getStatusColor(app.status)}`}>
                                      {app.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">{app.date}</td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <button onClick={() => handleReview(index)} className="text-blue-600 hover:text-blue-800 text-xs p-1 font-medium">Review</button>
                                      {app.status === 'Pending' || app.status === 'In Review' ? (
                                        <>
                                          <button onClick={() => handleApprove(index)} className="text-green-600 hover:text-green-800 text-xs p-1 font-medium">Approve</button>
                                          <button onClick={() => handleReject(index)} className="text-red-600 hover:text-red-800 text-xs p-1 font-medium">Reject</button>
                                        </>
                                      ) : null}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Users Tab Content */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="border bg-white rounded-lg shadow-sm mt-8">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
                      </div>
                      <div className="p-4 pt-0">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3">User ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Registration Date</th>
                                <th scope="col" className="px-6 py-3">Loans</th>
                                <th scope="col" className="px-6 py-3">Identification Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customers.map((customer) => (
                                <tr key={customer.customer_id} className="bg-white border-b hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{customer.customer_id}</td>
                                  <td className="px-6 py-4">{customer.first_name} {customer.last_name}</td>
                                  <td className="px-6 py-4">{customer.email}</td>
                                  <td className="px-6 py-4">{customer.created_at}</td>
                                  <td className="px-6 py-4">{customer.total}</td>
                                  <td className="px-6 py-4">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {customer.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <button onClick={() => handleView(customer.id)} className="text-blue-600 hover:text-blue-800 text-xs p-1 font-medium">View</button>
                                      <button onClick={() => handleEdit(customer.id)} className="text-gray-600 hover:text-gray-800 text-xs p-1 font-medium">Edit</button>
                                      {customer.status === 'Active' ? (
                                        <button onClick={() => handleSuspend(customer.id)} className="text-red-600 hover:text-red-800 text-xs p-1 font-medium">Suspend</button>
                                      ) : (
                                        <button onClick={() => handleActivate(customer.id)} className="text-green-600 hover:text-green-800 text-xs p-1 font-medium">Activate</button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

            </div>
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default Admin;