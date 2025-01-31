import React from "react";


const BecomeASeller = ({ requestHandle, onCancel }) => {
  
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-xl font-bold">Become A Seller!</h2>
                <p className="text-gray-600 mt-2 mb-4">
                    Please read all the terms & conditions before becoming a seller.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={requestHandle} // call the passed function
                        className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
                    >
                        Send Request
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BecomeASeller;
