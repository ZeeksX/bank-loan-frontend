import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

const Users = () => {
  const { allApplications, customers, loans } = useOutletContext() ?? { allApplications: [], customers: [], loans: [] };
  const handleView = (id) => console.log(`View item ${id}`);
  const handleEdit = (id) => console.log(`Edit item ${id}`);
  const handleSuspend = (id) => console.log(`Suspend item ${id}`);
  const handleActivate = (id) => console.log(`Activate item ${id}`);
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
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
  )
}

export default Users