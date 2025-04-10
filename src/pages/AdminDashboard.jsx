import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loader from '../components/ui/Loader'

const AdminDashboard = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch applications and customers in parallel
        const [applicationsResponse, customersResponse, loansResponse] = await Promise.all([
          fetch('http://localhost:8000/api/loans/applications', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
          }),
          fetch('http://localhost:8000/api/customers/all', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
          }),
          fetch('http://localhost:8000/api/loans', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          })
        ]);

        if (!applicationsResponse.ok || !customersResponse.ok || !loansResponse) {
          throw new Error('Failed to fetch data');
        }

        const applicationsData = await applicationsResponse.json();
        const customersData = await customersResponse.json();
        const loansData = await loansResponse.json();

        setAllApplications(applicationsData.data || []);
        setCustomers(customersData || []);
        setLoans(loansData || [])
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />
  }

  if (error) {
    console.error("Error fetching data: ", error)
  }

  return (
    <div className='flex flex-row'>
      <Sidebar />
      <div className='ml-64 flex flex-col min-h-screen w-full'>
        <Outlet context={{ allApplications, customers, loans }} />
      </div>
    </div>
  );
};

export default AdminDashboard;