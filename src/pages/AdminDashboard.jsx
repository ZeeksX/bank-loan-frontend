import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const [recentApplications, setRecentApplications] = useState([])

  useEffect(() => {
    const fetchRecentApplications = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/loans/applications', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        const data = await response.json();
        setRecentApplications(data);
      } catch (error) {
        console.error('Error fetching recent loan applications: ', error);
      }
    }

    fetchRecentApplications();
  }, [recentApplications])

  return (
    <>
      <div className='flex flex-row'>
        <Sidebar />
        <div className='ml-64 flex flex-col min-h-screen w-full'>
          <Outlet context={recentApplications} />
        </div>
      </div>
    </>
  )
}

export default AdminDashboard