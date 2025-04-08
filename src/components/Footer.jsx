import React from 'react'

const Footer = () => {
    return (
        <footer className="py-8 bg-secondary/50 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                                <span className="text-white font-bold text-xs">B</span>
                            </div>
                            <span className="font-medium">BankLoan</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">© 2023 BankLoan. All rights reserved.</p>
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