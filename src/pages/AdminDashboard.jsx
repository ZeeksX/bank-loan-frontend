import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  return (
    <>
      <div className='flex flex-row'>
        <Sidebar />
        <div className='flex flex-col min-h-screen'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AdminDashboard