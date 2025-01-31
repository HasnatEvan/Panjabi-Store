import { useState, useEffect } from "react";
import { data, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PanjabiDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [customerAddress, setCustomerAddress] = useState("");

    const { data: panjabi, isLoading, isError } = useQuery({
        queryKey: ["panjabi", id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/panjabi/${id}`);
            return data;
        },
    });

    useEffect(() => {
        if (panjabi) {
            setTotalPrice(panjabi.price * selectedQuantity);
        }
    }, [selectedQuantity, panjabi]);

    if (isLoading) return <div className="text-center text-xl font-semibold">Loading...</div>;
    if (isError) return <div className="text-center text-xl font-semibold text-red-600">Error loading data.</div>;

    const { name, description, image, price, quantity, sizeS, sizeM, sizeL,_id } = panjabi;

    const handlePurchaseClick = () => {
        setIsModalOpen(true);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1 && value <= quantity) {
            setSelectedQuantity(value);
            setTotalPrice(value * price);
        }
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
    
        if (!selectedSize) {
            Swal.fire("Error!", "Please select a size.", "error");
            return;
        }
    
        if (selectedQuantity < 1 || selectedQuantity > quantity) {
            Swal.fire("Error!", "Invalid quantity.", "error");
            return;
        }
    
        const purchaseInfo = {
            customer: {
                name: user?.displayName,
                email: user?.email,
                image: user?.photoURL
            },
            panjabiId: id,
            price: totalPrice,
            quantity: selectedQuantity,
            size: selectedSize,
            address: customerAddress,
            status: "pending",
        };
    
        try {
            const response = await axiosSecure.post("/purchases", purchaseInfo);
    
            if (response.data.insertedId) {
                // 🔹 Stock Quantity Update
                await axiosSecure.patch(`/panjabi/quantity/${_id}`, { quantityToUpdate: selectedQuantity,status:'decrease'});
    
                Swal.fire({
                    title: "Success!",
                    text: "Your purchase has been confirmed!",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    setIsModalOpen(false);
                    window.location.reload(); // ✅ রিফ্রেশ করে নতুন স্টক দেখাবে
                });
            } else {
                Swal.fire("Error!", "Something went wrong! Please try again.", "error");
            }
        } catch (error) {
            console.error("Purchase Error:", error);
            Swal.fire("Error!", "Something went wrong! Please try again.", "error");
        }
    };
    
    
    

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
                <div className="flex-shrink-0 w-full md:w-1/2">
                    <img src={image} alt={name} className="w-full max-h-96 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                </div>

                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{name}</h2>
                    <p className="text-lg text-gray-700 mb-6">{description}</p>
                    <p className="text-xl font-bold text-green-600 mb-4">Price: ${price}</p>
                    <p className="text-sm text-gray-500 mb-4">Quantity Available: {quantity}</p>

                    <button
                        className={`py-2 px-6 ${quantity > 0 ? "bg-blue-600" : "bg-gray-400"} text-white rounded-md hover:${
                            quantity > 0 ? "bg-blue-700" : "bg-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
                        disabled={quantity <= 0}
                        onClick={handlePurchaseClick}
                    >
                        {quantity > 0 ? "Purchase" : "Out of Stock"}
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
                        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Purchase Details</h3>
                        <form onSubmit={handlePurchase}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Select Size</label>
                                <select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                                    required
                                >
                                    <option value="">Choose a size</option>
                                    {sizeS && <option value="S">Size S</option>}
                                    {sizeM && <option value="M">Size M</option>}
                                    {sizeL && <option value="L">Size L</option>}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Select Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={quantity}
                                    value={selectedQuantity}
                                    onChange={handleQuantityChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                                <textarea
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                                    placeholder="Enter your shipping address"
                                    required
                                />
                            </div>

                            <p className="text-xl font-semibold text-green-600 mb-4">Total Price: ${totalPrice.toFixed(2)}</p>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Confirm Purchase
                            </button>
                        </form>

                        <button onClick={() => setIsModalOpen(false)} className="mt-6 text-blue-600 hover:underline text-sm block mx-auto">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanjabiDetails;
