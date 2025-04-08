import React from 'react'
import { Link } from 'react-router-dom'
import "../App.css"

const Landing = () => {
    return (
        <>
            <div>Dashboard</div>
            <Link to="/login">Login</Link>
        </>
    )
}

export default Landing