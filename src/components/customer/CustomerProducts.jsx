import React, { useEffect, useState } from 'react'
import TopNav from '../TopNav'
import { motion } from 'framer-motion';
import ProductCard from '../ui/ProductCard';
import { useOutletContext } from 'react-router-dom';
import illustration from "../../assets/illustration.svg";

const CustomerProducts = () => {
    const { productData, myLoans } = useOutletContext() ?? { productData: [], myLoans: [] };

    return (
        <>
            <TopNav />
            <div className={`flex inter flex-col w-full items-center p-6 bg-gray-100`}>
                <h1 className="text-2xl font-bold mb-4">Loan Products</h1>
                <p className="text-gray-600">Choose any loan product</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {productData.length > 0 ? (productData.map((product) => (
                        <motion.div
                            key={product.product_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: product.id * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                        >
                            <ProductCard product={product} />
                        </motion.div>

                    ))) : <>

                        <div className='w-full flex flex-col items-center mt-8'>
                            <img src={illustration} className='w-2/5' alt="Not found" />
                            <h1 className='text-xl text-center font-bold '>No loan product available </h1>
                        </div>
                    </>}
                </div>
            </div>

        </>
    )
}

export default CustomerProducts