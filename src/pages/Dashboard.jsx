import React from 'react'
import TopNav from '../components/TopNav'
import { Outlet } from 'react-router-dom'
import Footer from "../components/Footer"

const Dashboard = () => {
    return (
        <>
            <TopNav />
            <div className='mt-16 flex'>
                <Outlet />
            </div>
            <Footer/>
        </>

    )
}

export default Dashboard