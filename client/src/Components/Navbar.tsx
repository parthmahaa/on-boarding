import React, { useState } from 'react'
import img1 from '../assets/img1.png'

function Navbar() {
    const [showContact, setShowContact] = useState(false);
    return (
        <header className="flex flex-col sm:flex-row items-center mb-5">
            <div className="mr-4 mb-4 sm:mb-0">
                <img src={img1} alt="Emgage" width={100} height={75} />
            </div>
            <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Emgage !</h1>
                <p className="text-base text-gray-600 mt-1">
                    your all-in-one HRMS to simplify, streamline, and supercharge your people operation
                </p>
            </div>
            <div className="ml-0 sm:ml-auto flex items-center mt-4 sm:mt-0 relative">
                <button
                    className="p-1.5 mr-3 text-gray-500 hover:text-gray-700"
                    aria-label="Help"
                    type="button"
                    onClick={() => setShowContact((v) => !v)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                </button>
                {showContact && (
                    <div className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded shadow-lg p-4 w-64 text-sm">
                        <div className="font-semibold mb-2">Contact Support</div>
                        <div>
                            <div>
                                <span className="font-medium">Phone:</span> +91-9876543210
                            </div>
                            <div>
                                <span className="font-medium">Email:</span>{" "}
                                <a href="mailto:support@emgage.in" className="text-blue-600 underline">
                                    support@emgage.in
                                </a>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex items-center">
                    <img src={img1} alt="Emgage" width={30} height={30} />
                    <span className="ml-2 text-gray-700 font-medium text-sm">Emgage pvt ltd</span>
                </div>
            </div>
        </header>

    )
}

export default Navbar