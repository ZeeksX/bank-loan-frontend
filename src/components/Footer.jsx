import React from 'react'
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="inter py-8 bg-secondary/50 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ rotate: 0 }} // Keep or remove animation as preferred
                                animate={{ rotate: 360 }}
                                  transition={{ duration: 1, ease: "easeInOut" }}
                                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center"
                            >
                                <span className="text-white font-bold text-sm">B</span>
                            </motion.div>
                            <span className="font-semibold text-xl text-zinc-900">BankLoan</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">© 2025 BankLoan. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer