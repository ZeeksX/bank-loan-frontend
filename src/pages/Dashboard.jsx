import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const Dashboard = () => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchLoanProducts = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/loans/products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProductData(data);
            } catch (error) {
                console.error('Error fetching loan products: ', error);
            }
        };

        fetchLoanProducts();
    }, []);

    return (
        <>
            <TopNav />
            <div className="mt-16 flex">
                {/* Pass productData as context to child routes */}
                <Outlet context={productData} />
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;
