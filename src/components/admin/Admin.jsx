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
  const allApplications = useOutletContext() || [];

  const statsData = [
    {
      title: 'Total Users',
      value: '1,248',
      icon: Users,
      trend: '+12% from last month',
      color: 'blue'
    },
    {
      title: 'Active Loans',
      value: '842',
      icon: FileText,
      trend: '+5% from last month',
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: '$1.2M',
      icon: DollarSign,
      trend: '+18% from last month',
      color: 'green'
    },
    {
      title: 'Pending Approvals',
      value: '64',
      icon: AlertTriangle,
      trend: '12 need urgent review',
      color: 'amber'
    }
  ];
  const recentApplications = allApplications.slice(0, 5).map((app) => ({
    id: app.id,
    customer:app.customer,
    amount:app.amount,
    type:app.type,
    status:app.status,
    date: app.date
  }))

  const users = [
    { id: 'USR-1001', name: 'John Doe', email: 'john.doe@example.com', registrationDate: '2023-01-15', loans: 2, status: 'Active' },
    { id: 'USR-1002', name: 'Jane Smith', email: 'jane.smith@example.com', registrationDate: '2023-01-20', loans: 1, status: 'Active' },
    { id: 'USR-1003', name: 'Robert Johnson', email: 'robert.j@example.com', registrationDate: '2023-01-25', loans: 0, status: 'Active' },
    { id: 'USR-1004', name: 'Emily Williams', email: 'emily.w@example.com', registrationDate: '2023-02-05', loans: 1, status: 'Inactive' },
    { id: 'USR-1005', name: 'Michael Brown', email: 'michael.b@example.com', registrationDate: '2023-02-10', loans: 3, status: 'Active' },
    { id: 'USR-1006', name: 'Sarah Davis', email: 'sarah.d@example.com', registrationDate: '2023-02-15', loans: 0, status: 'Active' },
    { id: 'USR-1007', name: 'David Miller', email: 'david.m@example.com', registrationDate: '2023-02-20', loans: 2, status: 'Active' },
  ];

  const reports = [
    { id: 1, name: 'Monthly Loan Summary', period: 'March 2023', generatedOn: '2023-04-01', status: 'Completed' },
    { id: 2, name: 'User Acquisition Report', period: 'March 2023', generatedOn: '2023-04-01', status: 'Completed' },
    { id: 3, name: 'Revenue Analysis', period: 'March 2023', generatedOn: '2023-04-01', status: 'Completed' },
    { id: 4, name: 'Monthly Loan Summary', period: 'April 2023', generatedOn: '2023-05-01', status: 'In Progress' }, // Using future date for example
    { id: 5, name: 'User Acquisition Report', period: 'April 2023', generatedOn: '2023-05-01', status: 'In Progress' }, // Using future date for example
  ];

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
  const handleApprove = (id) => console.log(`Approve item ${id}`);
  const handleReject = (id) => console.log(`Reject item ${id}`);
  const handleEdit = (id) => console.log(`Edit item ${id}`);
  const handleSuspend = (id) => console.log(`Suspend item ${id}`);
  const handleActivate = (id) => console.log(`Activate item ${id}`);
  const handleDownload = (id) => console.log(`Download item ${id}`);

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
                  <button
                    onClick={() => handleTabChange('reports')}
                    className={`w-1/2 cursor-pointer sm:w-auto inline-block p-4 border-b-2 rounded-t-lg font-medium text-center ${activeTab === 'reports'
                      ? 'text-blue-600 border-blue-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    Reports
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
                              {allApplications.map((app) => (
                                <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{app.id}</td>
                                  <td className="px-6 py-4">{app.customer}</td>
                                  <td className="px-6 py-4">${app.amount.toLocaleString()}</td>
                                  <td className="px-6 py-4">{app.type}</td>
                                  <td className="px-6 py-4">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${getStatusColor(app.status)}`}>
                                      {app.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">{app.date}</td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <button onClick={() => handleView(app.id)} className="text-blue-600 hover:text-blue-800 text-xs p-1 font-medium">View</button>
                                      {app.status === 'Pending' || app.status === 'In Review' ? (
                                        <>
                                          <button onClick={() => handleApprove(app.id)} className="text-green-600 hover:text-green-800 text-xs p-1 font-medium">Approve</button>
                                          <button onClick={() => handleReject(app.id)} className="text-red-600 hover:text-red-800 text-xs p-1 font-medium">Reject</button>
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
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.id}</td>
                                  <td className="px-6 py-4">{user.name}</td>
                                  <td className="px-6 py-4">{user.email}</td>
                                  <td className="px-6 py-4">{user.registrationDate}</td>
                                  <td className="px-6 py-4">{user.loans}</td>
                                  <td className="px-6 py-4">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {user.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <button onClick={() => handleView(user.id)} className="text-blue-600 hover:text-blue-800 text-xs p-1 font-medium">View</button>
                                      <button onClick={() => handleEdit(user.id)} className="text-gray-600 hover:text-gray-800 text-xs p-1 font-medium">Edit</button>
                                      {user.status === 'Active' ? (
                                        <button onClick={() => handleSuspend(user.id)} className="text-red-600 hover:text-red-800 text-xs p-1 font-medium">Suspend</button>
                                      ) : (
                                        <button onClick={() => handleActivate(user.id)} className="text-green-600 hover:text-green-800 text-xs p-1 font-medium">Activate</button>
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


              {/* Reports Tab Content */}
              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="border bg-white rounded-lg shadow-sm mt-8">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Monthly Reports</h3>
                      </div>
                      <div className="p-4 pt-0">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3">Report Name</th>
                                <th scope="col" className="px-6 py-3">Period</th>
                                <th scope="col" className="px-6 py-3">Generated On</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reports.map((report) => (
                                <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{report.name}</td>
                                  <td className="px-6 py-4">{report.period}</td>
                                  <td className="px-6 py-4">{report.generatedOn}</td>
                                  <td className="px-6 py-4">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                      {report.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <button onClick={() => handleView(report.id)} className="text-blue-600 hover:text-blue-800 text-xs p-1 font-medium">View</button>
                                      <button onClick={() => handleDownload(report.id)} className="text-green-600 hover:text-green-800 text-xs p-1 font-medium">Download</button>
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