import React from 'react'
import TopNav from '../components/TopNav'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    return (
        <>
            <TopNav />
            <div className='mt-16 flex'>
                <Outlet />
            </div>

        </>

    )
}

export default Dashboard