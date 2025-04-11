import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import Loader from '../components/ui/Loader';

const Dashboard = () => {
    const [productData, setProductData] = useState([]);
    const [myLoans, setMyLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.userId) throw new Error('User not authenticated');

                const [productsRes, loansRes] = await Promise.all([
                    fetch('http://localhost:8000/api/loans/products'),
                    fetch(`http://localhost:8000/api/customers/${user.userId}/details-with-loans`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                        }
                    }),
                ]);

                if (!productsRes.ok) throw new Error(`Failed to fetch products`);
                if (!loansRes.ok) throw new Error(`Failed to fetch loans`);

                const products = await productsRes.json();
                const loans = await loansRes.json();

                setProductData(products);
                setMyLoans(loans);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <TopNav />
            {error && (
                <Toast
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                />
            )}

            <div className="mt-16 flex min-h-screen">
                <Outlet context={{ productData, myLoans }} />
            </div>

            <Footer />
        </>
    );
};

export default Dashboard;