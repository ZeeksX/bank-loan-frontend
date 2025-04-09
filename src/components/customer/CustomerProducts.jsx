import React, { useEffect, useState } from 'react'
import TopNav from '../TopNav'
import { motion } from 'framer-motion';
import ProductCard from '../ui/ProductCard';

const CustomerProducts = () => {
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const fetchLoanProducts = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/loans/products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProductData(data)

            } catch (error) {
                console.error('Error fetching loan products: ', error);
            }
        };

        fetchLoanProducts();
    }, []);

    return (
        <>
            <TopNav />
            <div className="flex inter flex-col w-full items-center p-6 min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Products</h1>
                <p className="text-gray-600">Choose any product of your choice</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productData.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: product.id * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </>
    )
}

export default CustomerProducts